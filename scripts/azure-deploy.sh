#!/bin/bash

# Azure Deployment Script for Guerilla Teaching
# This script automates the deployment of the entire application to Azure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="guerilla-teaching-rg"
LOCATION="eastus"
DB_SERVER_NAME="guerilla-teaching-db"
DB_ADMIN_USER="gtadmin"
STORAGE_ACCOUNT="guerillateachingstorage"
CONTAINER_APP_ENV="guerilla-teaching-env"
CONTAINER_APP_NAME="guerilla-teaching-backend"
STATIC_WEB_APP_NAME="guerilla-teaching-frontend"
FUNCTION_APP_NAME="guerilla-teaching-functions"
COMMUNICATION_SERVICE="guerilla-teaching-comms"

echo -e "${BLUE}🚀 Starting Azure deployment for Guerilla Teaching${NC}"
echo "=================================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Azure. Please log in first.${NC}"
    az login
fi

# Get current subscription
SUBSCRIPTION=$(az account show --query name -o tsv)
echo -e "${GREEN}✅ Using Azure subscription: ${SUBSCRIPTION}${NC}"

# Prompt for database password
echo -e "${YELLOW}🔐 Please enter a secure password for the PostgreSQL database:${NC}"
read -s DB_PASSWORD
echo

if [[ ${#DB_PASSWORD} -lt 8 ]]; then
    echo -e "${RED}❌ Password must be at least 8 characters long${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Creating Resource Group${NC}"
az group create --name $RESOURCE_GROUP --location $LOCATION
echo -e "${GREEN}✅ Resource group created${NC}"

echo -e "${BLUE}📊 Step 2: Creating PostgreSQL Database${NC}"
az postgres flexible-server create \
  --name $DB_SERVER_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --admin-user $DB_ADMIN_USER \
  --admin-password "$DB_PASSWORD" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 15

# Configure firewall
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Create database
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER_NAME \
  --database-name guerilla_teaching

echo -e "${GREEN}✅ PostgreSQL database created${NC}"

echo -e "${BLUE}💾 Step 3: Creating Storage Account${NC}"
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS

# Create blob container
az storage container create \
  --name assets \
  --account-name $STORAGE_ACCOUNT \
  --public-access blob

echo -e "${GREEN}✅ Storage account and container created${NC}"

echo -e "${BLUE}📧 Step 4: Creating Communication Services${NC}"
az communication create \
  --name $COMMUNICATION_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --location Global

echo -e "${GREEN}✅ Communication services created${NC}"

echo -e "${BLUE}🐳 Step 5: Creating Container Apps Environment${NC}"
# Install Container Apps extension if not already installed
az extension add --name containerapp --only-show-errors

az containerapp env create \
  --name $CONTAINER_APP_ENV \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

echo -e "${GREEN}✅ Container Apps environment created${NC}"

echo -e "${BLUE}🌐 Step 6: Creating Static Web App${NC}"
echo -e "${YELLOW}⚠️  You'll need to connect this to your GitHub repository manually${NC}"
az staticwebapp create \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

echo -e "${GREEN}✅ Static Web App created${NC}"

echo -e "${BLUE}⚡ Step 7: Creating Function App${NC}"
az functionapp create \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --storage-account $STORAGE_ACCOUNT

echo -e "${GREEN}✅ Function App created${NC}"

echo -e "${BLUE}🔗 Step 8: Getting connection strings${NC}"

# Get database connection string
DB_CONNECTION_STRING="postgresql://$DB_ADMIN_USER:$DB_PASSWORD@$DB_SERVER_NAME.postgres.database.azure.com:5432/guerilla_teaching?sslmode=require"

# Get storage connection string
STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query connectionString -o tsv)

# Get communication services connection string
COMMUNICATION_CONNECTION_STRING=$(az communication list-key \
  --name $COMMUNICATION_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --query primaryConnectionString -o tsv)

# Get Static Web App token
STATIC_WEB_APP_TOKEN=$(az staticwebapp secrets list \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.apiKey -o tsv)

echo -e "${GREEN}✅ Connection strings retrieved${NC}"

echo -e "${BLUE}📝 Step 9: Creating environment configuration file${NC}"

cat > azure-config.env << EOL
# Azure Configuration
# Generated on $(date)

# Resource Group
AZURE_RESOURCE_GROUP=$RESOURCE_GROUP

# Database
DATABASE_URL="$DB_CONNECTION_STRING"
POSTGRES_HOST=$DB_SERVER_NAME.postgres.database.azure.com
POSTGRES_USER=$DB_ADMIN_USER
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_DB=guerilla_teaching

# Storage
AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONNECTION_STRING"
AZURE_STORAGE_CONTAINER_NAME=assets

# Communication Services
AZURE_COMMUNICATION_CONNECTION_STRING="$COMMUNICATION_CONNECTION_STRING"
AZURE_EMAIL_SENDER_ADDRESS=noreply@guerillateaching.com

# Static Web App
AZURE_STATIC_WEB_APPS_API_TOKEN="$STATIC_WEB_APP_TOKEN"

# Application URLs (update after deployment)
VITE_API_URL=https://$CONTAINER_APP_NAME.azurecontainerapps.io
VITE_API_BASE_URL=https://$CONTAINER_APP_NAME.azurecontainerapps.io/api
VITE_SITE_URL=https://$STATIC_WEB_APP_NAME.azurestaticapps.net

# CORS Configuration
CORS_ORIGIN=https://$STATIC_WEB_APP_NAME.azurestaticapps.net
EOL

echo -e "${GREEN}✅ Configuration file created: azure-config.env${NC}"

echo "=================================================="
echo -e "${GREEN}🎉 Azure resources created successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Update your GitHub repository secrets with the values from azure-config.env"
echo "2. Build and push your backend container image"
echo "3. Deploy the container to Azure Container Apps"
echo "4. Connect your GitHub repository to Azure Static Web Apps"
echo "5. Run database migrations"
echo ""
echo -e "${BLUE}💡 Important files created:${NC}"
echo "- azure-config.env (environment variables)"
echo ""
echo -e "${BLUE}🔗 Useful commands:${NC}"
echo "- Deploy container: ./scripts/deploy-container.sh"
echo "- Migrate database: node scripts/migrate-d1-to-postgres.js"
echo "- View resources: az resource list --resource-group $RESOURCE_GROUP --output table"

echo ""
echo -e "${GREEN}✅ Deployment script completed!${NC}"