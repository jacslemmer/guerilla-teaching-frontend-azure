#!/bin/bash

# Guerilla Teaching Process Cleanup Script
# This script safely cleans up hanging processes and orphaned PIDs

set -e

echo "🧹 Cleaning up Guerilla Teaching processes..."

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${BLUE}[CLEANUP]${NC} $1"
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

# Function to safely kill process by PID
safe_kill() {
    local pid=$1
    local name=$2
    
    if kill -0 "$pid" 2>/dev/null; then
        print_message "Stopping $name (PID: $pid)..."
        kill "$pid" 2>/dev/null || true
        
        # Wait up to 10 seconds for graceful shutdown
        for i in {1..10}; do
            if ! kill -0 "$pid" 2>/dev/null; then
                print_success "$name stopped gracefully"
                return 0
            fi
            sleep 1
        done
        
        # Force kill if still running
        if kill -0 "$pid" 2>/dev/null; then
            print_warning "Force killing $name (PID: $pid)"
            kill -9 "$pid" 2>/dev/null || true
        fi
    else
        print_warning "$name (PID: $pid) not running"
    fi
}

# Function to clean up PID files
cleanup_pid_files() {
    print_message "Cleaning up PID files..."
    
    # Clean up main backend.pid
    if [ -f "backend.pid" ]; then
        local pid=$(cat backend.pid 2>/dev/null || echo "")
        if [ -n "$pid" ]; then
            safe_kill "$pid" "Backend (from backend.pid)"
        fi
        rm -f backend.pid
        print_success "Removed backend.pid"
    fi
    
    # Clean up logs directory PID files
    if [ -d "logs" ]; then
        for pidfile in logs/*.pid; do
            if [ -f "$pidfile" ]; then
                local pid=$(cat "$pidfile" 2>/dev/null || echo "")
                local name=$(basename "$pidfile" .pid)
                if [ -n "$pid" ]; then
                    safe_kill "$pid" "$name"
                fi
                rm -f "$pidfile"
                print_success "Removed $pidfile"
            fi
        done
    fi
}

# Function to find and kill hanging npm/node processes
cleanup_hanging_processes() {
    print_message "Looking for hanging npm/node processes..."
    
    # Find npm processes related to our project
    local npm_pids=$(pgrep -f "npm.*dev" 2>/dev/null || true)
    if [ -n "$npm_pids" ]; then
        print_warning "Found hanging npm dev processes: $npm_pids"
        for pid in $npm_pids; do
            # Check if process is in our project directory
            local cwd=$(pwdx "$pid" 2>/dev/null | awk '{print $2}' || echo "")
            if [[ "$cwd" == *"guerilla-teaching"* ]]; then
                safe_kill "$pid" "npm dev process"
            fi
        done
    fi
    
    # Find orphaned node processes
    local node_pids=$(pgrep -f "node.*guerilla" 2>/dev/null || true)
    if [ -n "$node_pids" ]; then
        print_warning "Found potential orphaned node processes: $node_pids"
        for pid in $node_pids; do
            # Only kill if it's been running for more than 1 hour
            local etime=$(ps -o etime= -p "$pid" 2>/dev/null || echo "")
            if [[ "$etime" == *":"* ]] && [[ $(echo "$etime" | cut -d: -f1) -gt 60 ]]; then
                print_warning "Killing long-running node process (PID: $pid, running: $etime)"
                safe_kill "$pid" "long-running node process"
            fi
        done
    fi
}

# Function to check for port conflicts
check_port_conflicts() {
    print_message "Checking for port conflicts..."
    
    local backend_port=${BACKEND_PORT:-3001}
    local frontend_port=${FRONTEND_PORT:-3000}
    
    # Check backend port
    local backend_proc=$(lsof -ti:$backend_port 2>/dev/null || true)
    if [ -n "$backend_proc" ]; then
        print_warning "Port $backend_port is in use by process $backend_proc"
        safe_kill "$backend_proc" "process using backend port $backend_port"
    fi
    
    # Check frontend port
    local frontend_proc=$(lsof -ti:$frontend_port 2>/dev/null || true)
    if [ -n "$frontend_proc" ]; then
        print_warning "Port $frontend_port is in use by process $frontend_proc"
        safe_kill "$frontend_proc" "process using frontend port $frontend_port"
    fi
}

# Function to fix terminal environment
fix_terminal_environment() {
    print_message "Fixing terminal environment..."
    
    # Set proper terminal dimensions to prevent screen size warnings
    export LINES=24
    export COLUMNS=80
    
    # Add to current shell
    echo "export LINES=24" >> ~/.bashrc
    echo "export COLUMNS=80" >> ~/.bashrc
    
    print_success "Terminal environment fixed"
}

# Function to create monitoring script
create_monitoring_script() {
    print_message "Creating process monitoring script..."
    
    cat > scripts/monitor-processes.sh << 'EOF'
#!/bin/bash

# Simple process monitor for development
while true; do
    if [ -f "logs/backend.pid" ]; then
        pid=$(cat logs/backend.pid)
        if ! kill -0 $pid 2>/dev/null; then
            echo "$(date): Backend process died (PID: $pid)" >> logs/monitor.log
        fi
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        pid=$(cat logs/frontend.pid)
        if ! kill -0 $pid 2>/dev/null; then
            echo "$(date): Frontend process died (PID: $pid)" >> logs/monitor.log
        fi
    fi
    
    sleep 30
done
EOF
    
    chmod +x scripts/monitor-processes.sh
    print_success "Process monitoring script created"
}

# Main execution
main() {
    print_message "Starting cleanup process..."
    
    cleanup_pid_files
    cleanup_hanging_processes
    check_port_conflicts
    fix_terminal_environment
    create_monitoring_script
    
    print_success "🎉 Cleanup completed successfully!"
    echo ""
    echo "📋 Summary:"
    echo "  - Cleaned up orphaned PID files"
    echo "  - Stopped hanging processes"
    echo "  - Freed up conflicting ports"
    echo "  - Fixed terminal environment"
    echo "  - Created process monitoring script"
    echo ""
    echo "🚀 You can now safely start the development environment with:"
    echo "  make dev"
    echo "  or"
    echo "  ./scripts/start-dev.sh"
}

# Run main function
main "$@"