# Shared Types Dockerfile for Development
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build and watch for changes
CMD ["npm", "run", "build"]