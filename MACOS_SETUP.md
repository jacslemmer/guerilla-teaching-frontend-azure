# macOS Setup Guide

This guide helps you set up the Guerilla Teaching V9 project on macOS for development.

## Prerequisites

### 1. Install Homebrew (Package Manager)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Development Tools
```bash
# Install Node.js and npm
brew install node

# Install Git (if not already installed)
brew install git

# Optional: Install Docker Desktop
brew install --cask docker
```

### 3. Verify Installation
```bash
node --version    # Should be 18+
npm --version
git --version
docker --version  # If Docker was installed
```

## Quick Setup

### Option 1: Using Makefile (Recommended)
```bash
# Clone the repository
git clone https://github.com/jacslemmer/guerilla-teaching-frontend-v9.git
cd guerilla-teaching-frontend-v9

# Quick start: install dependencies, setup environment, and start servers
make quick-start
```

### Option 2: Manual Setup
```bash
# Install dependencies for all components
make install

# Setup environment files
make setup-env

# Start development servers
make dev
```

## Development Workflow

### Starting Development
```bash
# Start both frontend and backend servers
make dev

# Alternative: Use Docker
make dev-docker
```

### Building for Production
```bash
# Build all components
make build

# Run tests
make test

# Clean build artifacts
make clean
```

### Monitoring Services
```bash
# Check service status
make status

# View logs
make logs

# Health check
make health
```

### Stopping Services
```bash
# Stop all services
make stop

# Or use Ctrl+C in the terminal running make dev
```

## Project Structure on macOS

```
guerilla-teaching-frontend-v9/
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js TypeScript backend
├── shared/            # Shared types and utilities
├── scripts/           # Build and deployment scripts (macOS compatible)
├── logs/              # Development logs
├── Makefile          # macOS-compatible build commands
└── MACOS_SETUP.md    # This file
```

## Ports and URLs

When running in development mode:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Backend Health**: http://localhost:3001/health

## Troubleshooting

### Permission Issues
```bash
# If you get permission errors, try:
sudo chown -R $(whoami) ~/.npm
```

### Port Already in Use
```bash
# Find and kill processes using ports 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Node Version Issues
```bash
# Update Node.js via Homebrew
brew upgrade node

# Or use Node Version Manager (nvm)
brew install nvm
nvm install 18
nvm use 18
```

### Docker Issues
```bash
# Start Docker Desktop app
open -a Docker

# Reset Docker if needed
docker system prune -af
```

## macOS-Specific Features

### File Watching
The project uses file watching for hot reloading. On macOS, this works natively without additional configuration.

### Environment Variables
Environment files are automatically created from `.env.example` files when you run `make setup-env`.

### Process Management
Development processes are managed using PID files in the `logs/` directory, making it easy to stop services cleanly.

## Next Steps

1. **Configure Environment Variables**: Review and update `.env` files in `frontend/` and `backend/` directories
2. **Database Setup**: If using a database, configure connection settings in `backend/.env`
3. **Development**: Start coding! The development server will auto-reload on file changes

## Getting Help

- Run `make help` to see all available commands
- Check `README.md` for general project information
- Check `V9_LAUNCH_INSTRUCTIONS.md` for deployment details