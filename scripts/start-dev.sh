#!/bin/bash

# Guerilla Teaching Development Environment Startup Script
# This script starts the development environment with proper dependency handling

set -e  # Exit on any error

echo "🚀 Starting Guerilla Teaching Development Environment..."

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${BLUE}[DEV-SETUP]${NC} $1"
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

# Check if required tools are installed
check_dependencies() {
    print_message "Checking dependencies..."
    
    command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed. Please install Node.js 18+"; exit 1; }
    command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed. Please install npm"; exit 1; }
    command -v docker >/dev/null 2>&1 || { print_warning "Docker not found. Container features will be disabled."; }
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Function to install dependencies
install_dependencies() {
    print_message "Installing dependencies..."
    
    # Install shared types first
    if [ -d "shared" ]; then
        print_message "Installing shared types..."
        cd shared
        npm install || { print_error "Shared types installation failed"; exit 1; }
        npm run build || { print_error "Shared types build failed"; exit 1; }
        cd ..
        print_success "Shared types installed and built"
    fi
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        print_message "Installing backend dependencies..."
        cd backend
        npm install || { print_error "Backend dependencies installation failed"; exit 1; }
        cd ..
        print_success "Backend dependencies installed"
    fi
    
    # Install frontend dependencies
    if [ -d "frontend" ]; then
        print_message "Installing frontend dependencies..."
        cd frontend
        npm install || { print_error "Frontend dependencies installation failed"; exit 1; }
        cd ..
        print_success "Frontend dependencies installed"
    fi
}

# Function to setup environment files
setup_environment() {
    print_message "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ] && [ -f "backend/.env.example" ]; then
        print_message "Creating backend/.env from .env.example"
        cp backend/.env.example backend/.env
        print_warning "Please review and update backend/.env with your configuration"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ] && [ -f "frontend/.env.example" ]; then
        print_message "Creating frontend/.env from .env.example"
        cp frontend/.env.example frontend/.env
        print_warning "Please review and update frontend/.env with your configuration"
    fi
    
    print_success "Environment setup complete"
}

# Function to start development servers
start_servers() {
    print_message "Starting development servers..."
    
    # Set default ports
    export BACKEND_PORT=${BACKEND_PORT:-3001}
    export FRONTEND_PORT=${FRONTEND_PORT:-3000}
    
    print_message "Backend will run on port $BACKEND_PORT"
    print_message "Frontend will run on port $FRONTEND_PORT"
    
    # Create logs directory
    mkdir -p logs
    
    # Start backend
    if [ -d "backend" ]; then
        print_message "Starting backend server..."
        cd backend
        PORT=$BACKEND_PORT npm run dev > ../logs/backend.log 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > ../logs/backend.pid
        cd ..
        print_success "Backend started (PID: $BACKEND_PID)"
    fi
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    if [ -d "frontend" ]; then
        print_message "Starting frontend server..."
        cd frontend
        PORT=$FRONTEND_PORT npm run dev > ../logs/frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > ../logs/frontend.pid
        cd ..
        print_success "Frontend started (PID: $FRONTEND_PID)"
    fi
}

# Function to check server health
check_health() {
    print_message "Checking server health..."
    
    # Wait for servers to fully start
    sleep 5
    
    # Check backend health with timeout
    if command -v curl >/dev/null 2>&1; then
        print_message "Checking backend health (up to 30 seconds)..."
        for i in {1..30}; do
            if curl -f --max-time 5 http://localhost:${BACKEND_PORT:-3001}/health >/dev/null 2>&1; then
                print_success "Backend health check passed"
                break
            elif [ $i -eq 30 ]; then
                print_warning "Backend health check failed after 30 seconds - check logs/backend.log"
            else
                sleep 1
            fi
        done
        
        print_message "Checking frontend health (up to 30 seconds)..."
        for i in {1..30}; do
            if curl -f --max-time 5 http://localhost:${FRONTEND_PORT:-3000} >/dev/null 2>&1; then
                print_success "Frontend health check passed"
                break
            elif [ $i -eq 30 ]; then
                print_warning "Frontend health check failed after 30 seconds - check logs/frontend.log"
            else
                sleep 1
            fi
        done
    else
        print_warning "curl not available - skipping health checks"
    fi
}

# Function to show running processes
show_status() {
    echo ""
    print_success "🎉 Development environment is running!"
    echo ""
    echo "📱 Frontend: http://localhost:${FRONTEND_PORT:-3000}"
    echo "🔧 Backend:  http://localhost:${BACKEND_PORT:-3001}"
    echo ""
    echo "📋 Management commands:"
    echo "  make logs    - View logs"
    echo "  make stop    - Stop all servers"
    echo "  make restart - Restart all servers"
    echo ""
    echo "📄 Log files:"
    echo "  Backend:  logs/backend.log"
    echo "  Frontend: logs/frontend.log"
    echo ""
    print_warning "Press Ctrl+C to stop all servers"
}

# Function to cleanup on exit
cleanup() {
    print_message "Stopping development servers..."
    
    if [ -f "logs/backend.pid" ]; then
        BACKEND_PID=$(cat logs/backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_success "Backend stopped"
        fi
        rm -f logs/backend.pid
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            print_success "Frontend stopped"
        fi
        rm -f logs/frontend.pid
    fi
    
    print_success "Development environment stopped"
}

# Trap Ctrl+C to cleanup
trap cleanup INT TERM

# Main execution
main() {
    check_dependencies
    
    # Parse command line arguments
    SKIP_DEPS=false
    SKIP_ENV=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-deps)
                SKIP_DEPS=true
                shift
                ;;
            --skip-env)
                SKIP_ENV=true
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --skip-deps    Skip dependency installation"
                echo "  --skip-env     Skip environment file setup"
                echo "  --help, -h     Show this help message"
                echo ""
                echo "Environment variables:"
                echo "  BACKEND_PORT   Backend server port (default: 3001)"
                echo "  FRONTEND_PORT  Frontend server port (default: 3000)"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    if [ "$SKIP_DEPS" = false ]; then
        install_dependencies
    fi
    
    if [ "$SKIP_ENV" = false ]; then
        setup_environment
    fi
    
    start_servers
    check_health
    show_status
    
    # Keep script running and monitoring
    while true; do
        sleep 10
        
        # Check if processes are still running
        if [ -f "logs/backend.pid" ]; then
            BACKEND_PID=$(cat logs/backend.pid)
            if ! kill -0 $BACKEND_PID 2>/dev/null; then
                print_error "Backend process died unexpectedly"
                break
            fi
        fi
        
        if [ -f "logs/frontend.pid" ]; then
            FRONTEND_PID=$(cat logs/frontend.pid)
            if ! kill -0 $FRONTEND_PID 2>/dev/null; then
                print_error "Frontend process died unexpectedly"
                break
            fi
        fi
    done
}

# Run main function
main "$@"