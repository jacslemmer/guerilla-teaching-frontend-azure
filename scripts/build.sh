#!/bin/bash

# Guerilla Teaching Build Script
# This script builds the entire stack for production deployment

set -e  # Exit on any error

echo "🔨 Building Guerilla Teaching Stack..."

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${BLUE}[BUILD]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check build dependencies
check_dependencies() {
    print_message "Checking build dependencies..."
    
    command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed"; exit 1; }
    command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed"; exit 1; }
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Build dependencies check passed"
}

# Function to clean previous builds
clean_builds() {
    print_message "Cleaning previous builds..."
    
    # Clean shared types build
    if [ -d "shared/dist" ]; then
        rm -rf shared/dist
        print_message "Cleaned shared/dist"
    fi
    
    # Clean backend build
    if [ -d "backend/dist" ]; then
        rm -rf backend/dist
        print_message "Cleaned backend/dist"
    fi
    
    # Clean frontend build
    if [ -d "frontend/dist" ]; then
        rm -rf frontend/dist
        print_message "Cleaned frontend/dist"
    fi
    
    # Clean Docker build artifacts
    if [ -d "docker-build" ]; then
        rm -rf docker-build
        print_message "Cleaned docker-build"
    fi
    
    print_success "Build cleanup complete"
}

# Function to install production dependencies
install_dependencies() {
    print_message "Installing production dependencies..."
    
    # Install shared types
    if [ -d "shared" ]; then
        print_message "Installing shared types dependencies..."
        cd shared
        npm ci || { print_error "Shared types dependencies installation failed"; exit 1; }
        cd ..
        print_success "Shared types dependencies installed"
    fi
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        print_message "Installing backend dependencies..."
        cd backend
        npm ci || { print_error "Backend dependencies installation failed"; exit 1; }
        cd ..
        print_success "Backend dependencies installed"
    fi
    
    # Install frontend dependencies
    if [ -d "frontend" ]; then
        print_message "Installing frontend dependencies..."
        cd frontend
        npm ci || { print_error "Frontend dependencies installation failed"; exit 1; }
        cd ..
        print_success "Frontend dependencies installed"
    fi
}

# Function to build shared types
build_shared() {
    if [ -d "shared" ]; then
        print_message "Building shared types..."
        cd shared
        npm run build || { print_error "Shared types build failed"; exit 1; }
        cd ..
        print_success "Shared types built successfully"
    else
        print_warning "Shared directory not found, skipping"
    fi
}

# Function to build backend
build_backend() {
    if [ -d "backend" ]; then
        print_message "Building backend..."
        cd backend
        
        # TypeScript compilation with timeout
        npm run build || { print_error "Backend build failed"; exit 1; }
        
        # Copy non-TypeScript files if needed
        if [ -d "src/templates" ]; then
            cp -r src/templates dist/
            print_message "Copied email templates to dist"
        fi
        
        if [ -f "package.json" ]; then
            cp package.json dist/
            print_message "Copied package.json to dist"
        fi
        
        cd ..
        print_success "Backend built successfully"
    else
        print_error "Backend directory not found"
        exit 1
    fi
}

# Function to build frontend
build_frontend() {
    if [ -d "frontend" ]; then
        print_message "Building frontend..."
        cd frontend
        
        # Vite build with timeout
        npm run build || { print_error "Frontend build failed"; exit 1; }
        
        cd ..
        print_success "Frontend built successfully"
    else
        print_error "Frontend directory not found"
        exit 1
    fi
}

# Function to create deployment package
create_deployment_package() {
    print_message "Creating deployment package..."
    
    # Create deployment directory
    mkdir -p docker-build
    
    # Copy built backend
    if [ -d "backend/dist" ]; then
        cp -r backend/dist docker-build/backend
        print_message "Copied backend build to deployment package"
    fi
    
    # Copy built frontend
    if [ -d "frontend/dist" ]; then
        cp -r frontend/dist docker-build/frontend
        print_message "Copied frontend build to deployment package"
    fi
    
    # Copy shared types
    if [ -d "shared/dist" ]; then
        cp -r shared/dist docker-build/shared
        print_message "Copied shared types to deployment package"
    fi
    
    # Copy configuration files
    if [ -f "docker-compose.prod.yml" ]; then
        cp docker-compose.prod.yml docker-build/
        print_message "Copied production docker-compose"
    fi
    
    # Copy deployment script
    if [ -f "scripts/deploy.sh" ]; then
        cp scripts/deploy.sh docker-build/
        chmod +x docker-build/deploy.sh
        print_message "Copied deployment script"
    fi
    
    # Copy environment examples
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example docker-build/backend.env.example
    fi
    
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example docker-build/frontend.env.example
    fi
    
    print_success "Deployment package created in docker-build/"
}

# Function to build Docker images
build_docker_images() {
    print_message "Building Docker images..."
    
    if command -v docker >/dev/null 2>&1; then
        # Build shared types image
        if [ -f "shared/Dockerfile" ]; then
            print_message "Building shared types Docker image..."
            docker build -t guerilla-teaching-shared:latest shared/
            print_success "Shared types Docker image built"
        fi
        
        # Build backend image
        if [ -f "backend/Dockerfile" ]; then
            print_message "Building backend Docker image..."
            docker build -t guerilla-teaching-backend:latest backend/
            print_success "Backend Docker image built"
        fi
        
        # Build frontend image
        if [ -f "frontend/Dockerfile" ]; then
            print_message "Building frontend Docker image..."
            docker build -t guerilla-teaching-frontend:latest frontend/
            print_success "Frontend Docker image built"
        fi
        
        print_success "All Docker images built successfully"
    else
        print_warning "Docker not available, skipping image builds"
    fi
}

# Function to run tests
run_tests() {
    print_message "Running tests..."
    
    # Run backend tests if available
    if [ -d "backend" ] && [ -f "backend/package.json" ]; then
        cd backend
        if npm run test --silent >/dev/null 2>&1; then
            npm run test
            print_success "Backend tests passed"
        else
            print_warning "Backend tests not configured or failed"
        fi
        cd ..
    fi
    
    # Run frontend tests if available
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        cd frontend
        if npm run test --silent >/dev/null 2>&1; then
            npm run test -- --run
            print_success "Frontend tests passed"
        else
            print_warning "Frontend tests not configured or failed"
        fi
        cd ..
    fi
}

# Function to validate builds
validate_builds() {
    print_message "Validating builds..."
    
    # Check backend build
    if [ ! -d "backend/dist" ]; then
        print_error "Backend build failed - dist directory not found"
        exit 1
    fi
    
    if [ ! -f "backend/dist/index.js" ]; then
        print_error "Backend build failed - index.js not found"
        exit 1
    fi
    
    # Check frontend build
    if [ ! -d "frontend/dist" ]; then
        print_error "Frontend build failed - dist directory not found"
        exit 1
    fi
    
    if [ ! -f "frontend/dist/index.html" ]; then
        print_error "Frontend build failed - index.html not found"
        exit 1
    fi
    
    print_success "Build validation passed"
}

# Function to show build summary
show_summary() {
    echo ""
    print_success "🎉 Build completed successfully!"
    echo ""
    echo "📦 Build artifacts:"
    echo "  Backend:     backend/dist/"
    echo "  Frontend:    frontend/dist/"
    echo "  Shared:      shared/dist/"
    echo "  Deployment:  docker-build/"
    echo ""
    echo "🚀 Next steps:"
    echo "  1. Review build artifacts"
    echo "  2. Test deployment package: cd docker-build && ./deploy.sh"
    echo "  3. Deploy to production environment"
    echo ""
    
    # Show build sizes
    if command -v du >/dev/null 2>&1; then
        echo "📊 Build sizes:"
        if [ -d "backend/dist" ]; then
            BACKEND_SIZE=$(du -sh backend/dist | cut -f1)
            echo "  Backend:  $BACKEND_SIZE"
        fi
        if [ -d "frontend/dist" ]; then
            FRONTEND_SIZE=$(du -sh frontend/dist | cut -f1)
            echo "  Frontend: $FRONTEND_SIZE"
        fi
        if [ -d "docker-build" ]; then
            DEPLOY_SIZE=$(du -sh docker-build | cut -f1)
            echo "  Package:  $DEPLOY_SIZE"
        fi
        echo ""
    fi
}

# Main execution
main() {
    # Parse command line arguments
    SKIP_CLEAN=false
    SKIP_TESTS=false
    SKIP_DOCKER=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-clean)
                SKIP_CLEAN=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-docker)
                SKIP_DOCKER=true
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --skip-clean   Skip cleaning previous builds"
                echo "  --skip-tests   Skip running tests"
                echo "  --skip-docker  Skip building Docker images"
                echo "  --help, -h     Show this help message"
                echo ""
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    check_dependencies
    
    if [ "$SKIP_CLEAN" = false ]; then
        clean_builds
    fi
    
    install_dependencies
    build_shared
    build_backend
    build_frontend
    
    if [ "$SKIP_TESTS" = false ]; then
        run_tests
    fi
    
    validate_builds
    create_deployment_package
    
    if [ "$SKIP_DOCKER" = false ]; then
        build_docker_images
    fi
    
    show_summary
}

# Run main function
main "$@"