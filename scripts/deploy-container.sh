#!/bin/bash

# Container Deployment Script for Azure Container Apps
# Builds and deploys the backend container to Azure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="guerilla-teaching-rg"
CONTAINER_APP_ENV="guerilla-teaching-env"
CONTAINER_APP_NAME="guerilla-teaching-backend"
IMAGE_NAME="guerilla-teaching-backend"
REGISTRY_NAME="guerillateachingregistry"

echo -e "${BLUE}🐳 Starting container deployment to Azure${NC}"
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if azure-config.env exists
if [[ ! -f "azure-config.env" ]]; then
    echo -e "${RED}❌ azure-config.env not found. Please run azure-deploy.sh first.${NC}"
    exit 1
fi

# Load configuration
source azure-config.env

echo -e "${BLUE}📦 Step 1: Creating Azure Container Registry${NC}"
# Create ACR if it doesn't exist
if ! az acr show --name $REGISTRY_NAME --resource-group $RESOURCE_GROUP > /dev/null 2>&1; then
    az acr create \
        --name $REGISTRY_NAME \
        --resource-group $RESOURCE_GROUP \
        --sku Basic \
        --admin-enabled true
    echo -e "${GREEN}✅ Container registry created${NC}"
else
    echo -e "${YELLOW}⚠️  Container registry already exists${NC}"
fi

# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name $REGISTRY_NAME --resource-group $RESOURCE_GROUP --query loginServer -o tsv)
FULL_IMAGE_NAME="$ACR_LOGIN_SERVER/$IMAGE_NAME:latest"

echo -e "${BLUE}🔨 Step 2: Building container image${NC}"
cd backend
docker build -t $FULL_IMAGE_NAME .
cd ..
echo -e "${GREEN}✅ Container image built${NC}"

echo -e "${BLUE}🔐 Step 3: Logging into Azure Container Registry${NC}"
az acr login --name $REGISTRY_NAME
echo -e "${GREEN}✅ Logged into ACR${NC}"

echo -e "${BLUE}📤 Step 4: Pushing image to registry${NC}"
docker push $FULL_IMAGE_NAME
echo -e "${GREEN}✅ Image pushed to registry${NC}"

echo -e "${BLUE}🚀 Step 5: Deploying to Container Apps${NC}"

# Check if container app exists
if az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Updating existing container app${NC}"

    az containerapp update \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --image $FULL_IMAGE_NAME \
        --set-env-vars \
            NODE_ENV=production \
            PORT=3001 \
            DATABASE_URL="$DATABASE_URL" \
            AZURE_STORAGE_CONNECTION_STRING="$AZURE_STORAGE_CONNECTION_STRING" \
            AZURE_STORAGE_CONTAINER_NAME=assets \
            AZURE_COMMUNICATION_CONNECTION_STRING="$AZURE_COMMUNICATION_CONNECTION_STRING" \
            AZURE_EMAIL_SENDER_ADDRESS=noreply@guerillateaching.com \
            CORS_ORIGIN="$CORS_ORIGIN" \
            LOG_LEVEL=info
else
    echo -e "${YELLOW}⚠️  Creating new container app${NC}"

    az containerapp create \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --environment $CONTAINER_APP_ENV \
        --image $FULL_IMAGE_NAME \
        --target-port 3001 \
        --ingress external \
        --min-replicas 0 \
        --max-replicas 10 \
        --cpu 0.5 \
        --memory 1Gi \
        --env-vars \
            NODE_ENV=production \
            PORT=3001 \
            DATABASE_URL="$DATABASE_URL" \
            AZURE_STORAGE_CONNECTION_STRING="$AZURE_STORAGE_CONNECTION_STRING" \
            AZURE_STORAGE_CONTAINER_NAME=assets \
            AZURE_COMMUNICATION_CONNECTION_STRING="$AZURE_COMMUNICATION_CONNECTION_STRING" \
            AZURE_EMAIL_SENDER_ADDRESS=noreply@guerillateaching.com \
            CORS_ORIGIN="$CORS_ORIGIN" \
            LOG_LEVEL=info
fi

echo -e "${GREEN}✅ Container app deployed${NC}"

echo -e "${BLUE}🔗 Step 6: Getting application URL${NC}"
APP_URL=$(az containerapp show \
    --name $CONTAINER_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query properties.configuration.ingress.fqdn -o tsv)

if [[ -n "$APP_URL" ]]; then
    echo -e "${GREEN}✅ Application deployed successfully!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Application URL: https://$APP_URL${NC}"
    echo -e "${BLUE}🔍 Health check: https://$APP_URL/health${NC}"

    # Update the config file with the actual URL
    sed -i.bak "s|VITE_API_URL=.*|VITE_API_URL=https://$APP_URL|g" azure-config.env
    sed -i.bak "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=https://$APP_URL/api|g" azure-config.env
    rm azure-config.env.bak

    echo -e "${GREEN}✅ Updated azure-config.env with actual URLs${NC}"

    echo ""
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo "1. Test the API: curl https://$APP_URL/health"
    echo "2. Run database migrations if needed"
    echo "3. Update your frontend environment variables"
    echo "4. Deploy the frontend to Azure Static Web Apps"
else
    echo -e "${RED}❌ Failed to get application URL${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Container deployment completed!${NC}"