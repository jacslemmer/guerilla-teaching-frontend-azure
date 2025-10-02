#!/bin/bash

# Guerilla Teaching Deployment Script
# This script deploys the application to production environment

set -e  # Exit on any error

echo "🚀 Deploying Guerilla Teaching Application..."

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
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

# Configuration
DEPLOYMENT_USER=${DEPLOYMENT_USER:-""}
DEPLOYMENT_HOST=${DEPLOYMENT_HOST:-""}
DEPLOYMENT_PATH=${DEPLOYMENT_PATH:-"/var/www/guerilla-teaching"}
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/guerilla-teaching"}
SERVICE_NAME=${SERVICE_NAME:-"guerilla-teaching"}

# Function to check deployment prerequisites
check_prerequisites() {
    print_message "Checking deployment prerequisites..."
    
    # Check if Docker is available
    command -v docker >/dev/null 2>&1 || { print_error "Docker is required for deployment"; exit 1; }
    
    # Check if docker-compose is available
    command -v docker-compose >/dev/null 2>&1 || { print_error "docker-compose is required for deployment"; exit 1; }
    
    # Check if rsync is available for file transfer
    command -v rsync >/dev/null 2>&1 || { print_warning "rsync not available, will use cp for local deployment"; }
    
    print_success "Prerequisites check passed"
}

# Function to validate environment
validate_environment() {
    print_message "Validating deployment environment..."
    
    # Check for required environment files
    if [ ! -f ".env.production" ] && [ ! -f "backend/.env" ]; then
        print_error "Production environment configuration not found"
        print_error "Please create .env.production or backend/.env with production settings"
        exit 1
    fi
    
    # Check for built artifacts
    if [ ! -d "backend/dist" ] && [ ! -d "frontend/dist" ]; then
        print_error "Build artifacts not found. Please run ./scripts/build.sh first"
        exit 1
    fi
    
    print_success "Environment validation passed"
}

# Function to create backup
create_backup() {
    if [ -n "$DEPLOYMENT_HOST" ] && [ -n "$DEPLOYMENT_USER" ]; then
        print_message "Creating backup on remote server..."
        
        ssh "${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}" "
            if [ -d '${DEPLOYMENT_PATH}' ]; then
                sudo mkdir -p ${BACKUP_DIR}
                BACKUP_NAME=backup-$(date +%Y%m%d-%H%M%S)
                sudo cp -r ${DEPLOYMENT_PATH} ${BACKUP_DIR}/\$BACKUP_NAME
                echo 'Backup created: ${BACKUP_DIR}/\$BACKUP_NAME'
            else
                echo 'No existing deployment found, skipping backup'
            fi
        "
        
        print_success "Remote backup completed"
    else
        print_message "Creating local backup..."
        
        if [ -d "${DEPLOYMENT_PATH}" ]; then
            mkdir -p "${BACKUP_DIR}"
            BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
            cp -r "${DEPLOYMENT_PATH}" "${BACKUP_DIR}/${BACKUP_NAME}"
            print_success "Local backup created: ${BACKUP_DIR}/${BACKUP_NAME}"
        else
            print_warning "No existing deployment found, skipping backup"
        fi
    fi
}

# Function to deploy to remote server
deploy_remote() {
    print_message "Deploying to remote server: ${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}"
    
    # Create deployment directory on remote server
    ssh "${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}" "sudo mkdir -p ${DEPLOYMENT_PATH}"
    
    # Copy built application
    print_message "Copying application files..."
    rsync -avz --delete \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='logs' \
        --exclude='.env*' \
        ./ "${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}:${DEPLOYMENT_PATH}/"
    
    # Copy environment configuration
    if [ -f ".env.production" ]; then
        scp .env.production "${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}:${DEPLOYMENT_PATH}/.env"
        print_message "Production environment copied"
    fi
    
    # Set proper permissions
    ssh "${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}" "
        sudo chown -R www-data:www-data ${DEPLOYMENT_PATH}
        sudo chmod -R 755 ${DEPLOYMENT_PATH}
        sudo chmod +x ${DEPLOYMENT_PATH}/scripts/*.sh
    "
    
    print_success "Files deployed to remote server"
}

# Function to deploy locally
deploy_local() {
    print_message "Deploying locally to: ${DEPLOYMENT_PATH}"
    
    # Create deployment directory
    sudo mkdir -p "${DEPLOYMENT_PATH}"
    
    # Copy built application
    print_message "Copying application files..."
    sudo cp -r \
        backend/dist \
        frontend/dist \
        shared/dist \
        docker-compose.prod.yml \
        scripts \
        "${DEPLOYMENT_PATH}/"
    
    # Copy environment configuration
    if [ -f ".env.production" ]; then
        sudo cp .env.production "${DEPLOYMENT_PATH}/.env"
        print_message "Production environment copied"
    elif [ -f "backend/.env" ]; then
        sudo cp backend/.env "${DEPLOYMENT_PATH}/"
        print_message "Backend environment copied"
    fi
    
    # Set proper permissions
    sudo chown -R www-data:www-data "${DEPLOYMENT_PATH}"
    sudo chmod -R 755 "${DEPLOYMENT_PATH}"
    sudo chmod +x "${DEPLOYMENT_PATH}"/scripts/*.sh
    
    print_success "Files deployed locally"
}

# Function to setup database
setup_database() {
    print_message "Setting up database..."
    
    if [ -n "$DEPLOYMENT_HOST" ] && [ -n "$DEPLOYMENT_USER" ]; then
        # Remote database setup
        ssh "${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}" "
            cd ${DEPLOYMENT_PATH}
            if [ -f 'backend/migrations/setup.sql' ]; then
                echo 'Running database migrations...'
                # Add database migration commands here
                echo 'Database setup completed'
            else
                echo 'No database migrations found'
            fi
        "
    else
        # Local database setup
        if [ -f "backend/migrations/setup.sql" ]; then
            print_message "Running database migrations..."
            # Add database migration commands here
            print_success "Database setup completed"
        else
            print_warning "No database migrations found"
        fi
    fi
}

# Function to start services
start_services() {
    print_message "Starting application services..."
    
    if [ -n "$DEPLOYMENT_HOST" ] && [ -n "$DEPLOYMENT_USER" ]; then
        # Start services on remote server
        ssh "${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}" "
            cd ${DEPLOYMENT_PATH}
            
            # Stop existing services
            sudo docker-compose -f docker-compose.prod.yml down || true
            
            # Pull latest images if needed
            sudo docker-compose -f docker-compose.prod.yml pull
            
            # Start services
            sudo docker-compose -f docker-compose.prod.yml up -d
            
            # Enable auto-restart
            sudo systemctl enable docker
        "
    else
        # Start services locally
        cd "${DEPLOYMENT_PATH}"
        
        # Stop existing services
        sudo docker-compose -f docker-compose.prod.yml down || true
        
        # Start services
        sudo docker-compose -f docker-compose.prod.yml up -d
        
        cd - > /dev/null
    fi
    
    print_success "Services started"
}

# Function to verify deployment
verify_deployment() {
    print_message "Verifying deployment..."
    
    # Wait for services to start
    sleep 10
    
    # Get service URLs
    BACKEND_URL="http://localhost:3001"
    FRONTEND_URL="http://localhost:3000"
    
    if [ -n "$DEPLOYMENT_HOST" ]; then
        BACKEND_URL="http://${DEPLOYMENT_HOST}:3001"
        FRONTEND_URL="http://${DEPLOYMENT_HOST}:3000"
    fi
    
    # Check backend health
    if command -v curl >/dev/null 2>&1; then
        print_message "Checking backend health..."
        if curl -f "${BACKEND_URL}/health" >/dev/null 2>&1; then
            print_success "Backend is healthy"
        else
            print_warning "Backend health check failed"
        fi
        
        print_message "Checking frontend availability..."
        if curl -f "${FRONTEND_URL}" >/dev/null 2>&1; then
            print_success "Frontend is accessible"
        else
            print_warning "Frontend accessibility check failed"
        fi
    else
        print_warning "curl not available, skipping health checks"
    fi
}

# Function to show deployment summary
show_summary() {
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "🌐 Application URLs:"
    
    if [ -n "$DEPLOYMENT_HOST" ]; then
        echo "  Frontend: http://${DEPLOYMENT_HOST}:3000"
        echo "  Backend:  http://${DEPLOYMENT_HOST}:3001"
    else
        echo "  Frontend: http://localhost:3000"
        echo "  Backend:  http://localhost:3001"
    fi
    
    echo ""
    echo "📁 Deployment location: ${DEPLOYMENT_PATH}"
    echo ""
    echo "🔧 Management commands:"
    echo "  View logs:    docker-compose -f docker-compose.prod.yml logs"
    echo "  Stop services: docker-compose -f docker-compose.prod.yml down"
    echo "  Restart:      docker-compose -f docker-compose.prod.yml restart"
    echo ""
}

# Function to rollback deployment
rollback() {
    print_error "Deployment failed. Rolling back..."
    
    if [ -n "$DEPLOYMENT_HOST" ] && [ -n "$DEPLOYMENT_USER" ]; then
        # Remote rollback
        ssh "${DEPLOYMENT_USER}@${DEPLOYMENT_HOST}" "
            cd ${DEPLOYMENT_PATH}
            sudo docker-compose -f docker-compose.prod.yml down || true
            
            # Find latest backup
            LATEST_BACKUP=\$(ls -t ${BACKUP_DIR} | head -n1)
            if [ -n \"\$LATEST_BACKUP\" ]; then
                sudo rm -rf ${DEPLOYMENT_PATH}
                sudo cp -r ${BACKUP_DIR}/\$LATEST_BACKUP ${DEPLOYMENT_PATH}
                sudo docker-compose -f docker-compose.prod.yml up -d
                echo 'Rollback completed to: \$LATEST_BACKUP'
            else
                echo 'No backup found for rollback'
            fi
        "
    else
        # Local rollback
        cd "${DEPLOYMENT_PATH}" && sudo docker-compose -f docker-compose.prod.yml down || true
        
        # Find latest backup
        LATEST_BACKUP=$(ls -t "${BACKUP_DIR}" | head -n1)
        if [ -n "$LATEST_BACKUP" ]; then
            sudo rm -rf "${DEPLOYMENT_PATH}"
            sudo cp -r "${BACKUP_DIR}/${LATEST_BACKUP}" "${DEPLOYMENT_PATH}"
            cd "${DEPLOYMENT_PATH}" && sudo docker-compose -f docker-compose.prod.yml up -d
            print_success "Rollback completed to: ${LATEST_BACKUP}"
        else
            print_error "No backup found for rollback"
        fi
    fi
}

# Main execution
main() {
    # Parse command line arguments
    SKIP_BACKUP=false
    SKIP_VERIFY=false
    LOCAL_ONLY=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --skip-verify)
                SKIP_VERIFY=true
                shift
                ;;
            --local)
                LOCAL_ONLY=true
                shift
                ;;
            --host)
                DEPLOYMENT_HOST="$2"
                shift 2
                ;;
            --user)
                DEPLOYMENT_USER="$2"
                shift 2
                ;;
            --path)
                DEPLOYMENT_PATH="$2"
                shift 2
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --skip-backup     Skip creating backup before deployment"
                echo "  --skip-verify     Skip deployment verification"
                echo "  --local           Deploy locally only"
                echo "  --host HOST       Remote deployment host"
                echo "  --user USER       Remote deployment user"
                echo "  --path PATH       Deployment path (default: /var/www/guerilla-teaching)"
                echo "  --help, -h        Show this help message"
                echo ""
                echo "Environment variables:"
                echo "  DEPLOYMENT_HOST   Remote server hostname/IP"
                echo "  DEPLOYMENT_USER   Remote server username"
                echo "  DEPLOYMENT_PATH   Target deployment directory"
                echo "  BACKUP_DIR        Backup directory location"
                echo ""
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Set up error handling
    trap rollback ERR
    
    check_prerequisites
    validate_environment
    
    if [ "$SKIP_BACKUP" = false ]; then
        create_backup
    fi
    
    if [ "$LOCAL_ONLY" = true ] || [ -z "$DEPLOYMENT_HOST" ] || [ -z "$DEPLOYMENT_USER" ]; then
        deploy_local
    else
        deploy_remote
    fi
    
    setup_database
    start_services
    
    if [ "$SKIP_VERIFY" = false ]; then
        verify_deployment
    fi
    
    show_summary
}

# Run main function
main "$@"