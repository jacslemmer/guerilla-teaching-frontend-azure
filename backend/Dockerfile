# Multi-stage Dockerfile for Azure Container Apps

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling and curl for health checks
RUN apk add --no-cache dumb-init curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create necessary directories
RUN mkdir -p logs uploads && chown -R nodejs:nodejs logs uploads

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (Azure Container Apps can dynamically assign ports)
EXPOSE 3001

# Health check for Azure Container Apps
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Environment variables with defaults for Azure
ENV NODE_ENV=production
ENV PORT=3001
ENV LOG_LEVEL=info

# Use dumb-init to handle signals properly (important for Azure Container Apps scaling)
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]