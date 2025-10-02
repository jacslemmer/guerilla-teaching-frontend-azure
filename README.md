# Guerilla Teaching Website V9

A modern, responsive website for Guerilla Teaching built with React TypeScript frontend and Node.js TypeScript backend.

## Project Structure

```
guerilla-teaching-website/
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js TypeScript backend
├── shared/            # Shared types and utilities
└── README.md          # This file
```

## Prerequisites

Before running this project, you need to install:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - For macOS: Consider using [Homebrew](https://brew.sh/): `brew install node`

2. **npm** (comes with Node.js)

3. **Docker Desktop** (optional, for containerized development)
   - Download from: https://www.docker.com/products/docker-desktop/
   - Required for `make dev-docker` and production deployments

## Installation Steps

### 1. Install Node.js on macOS

**Option A: Direct Download**
- Go to https://nodejs.org/
- Download and install the LTS version
- Restart your terminal after installation

**Option B: Using Homebrew (Recommended)**
```bash
# Install Homebrew if you haven't already
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

### 2. Verify Installation
```bash
node --version
npm --version
```

### 3. Install Dependencies

You can install dependencies using the convenient Makefile commands:

```bash
# Install all dependencies (shared, backend, frontend)
make install

# Or manually install each component
cd shared && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

## Development

### Quick Start (Recommended)
```bash
# Install dependencies, setup environment, and start development servers
make quick-start

# Or just start development servers (if already installed)
make dev
```

### Manual Start

#### Start Frontend (Development Mode)
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

#### Start Backend (Development Mode)
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:3001

### Using Docker (Alternative)
```bash
# Start with Docker Compose
make dev-docker
```

## Production Build

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Build
```bash
cd backend
npm run build
```

## Deployment

This project supports multiple deployment options:

### macOS Development Deployment
- **Frontend**: Served via Vite dev server or static build
- **Backend**: Node.js with development server
- **Environment**: Native macOS

### Production Deployment Options
1. **Docker Compose** (Recommended)
   ```bash
   make prod-up
   ```

2. **Manual Deployment**
   - **Frontend**: Apache/Nginx web server (static files)
   - **Backend**: Node.js with PM2 process manager
   - **Environment**: Linux servers, macOS, or Docker

### Available Makefile Commands
```bash
make help          # Show all available commands
make quick-start   # Install deps, setup env, start dev
make dev           # Start development environment
make build         # Build entire stack
make test          # Run all tests
make clean         # Clean build artifacts
make deploy        # Deploy to production
```

See `V9_LAUNCH_INSTRUCTIONS.md` for detailed deployment instructions.

## Features

- Modern, responsive design
- TypeScript for type safety
- RESTful API backend
- Component-based architecture
- SEO optimized
- Mobile-first approach

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router
- Axios for API calls
- CSS Modules / Styled Components

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (optional)
- JWT Authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to Guerilla Teaching. 