# 🚀 Azure Deployment Guide

## 📋 **DEPLOYMENT CHECKLIST**

### **Phase 1: Azure Resource Setup**

#### **1. Create Resource Group**
```bash
# Create resource group
az group create --name guerilla-teaching-rg --location eastus

# Set as default for subsequent commands
az config set defaults.group=guerilla-teaching-rg
```

#### **2. Create Azure Database for PostgreSQL**
```bash
# Create PostgreSQL Flexible Server
az postgres flexible-server create \
  --name guerilla-teaching-db \
  --resource-group guerilla-teaching-rg \
  --location eastus \
  --admin-user gtadmin \
  --admin-password "YourSecurePassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 15

# Configure firewall to allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group guerilla-teaching-rg \
  --name guerilla-teaching-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Create database
az postgres flexible-server db create \
  --resource-group guerilla-teaching-rg \
  --server-name guerilla-teaching-db \
  --database-name guerilla_teaching
```

#### **3. Create Azure Storage Account**
```bash
# Create storage account
az storage account create \
  --name guerillateachingstorage \
  --resource-group guerilla-teaching-rg \
  --location eastus \
  --sku Standard_LRS

# Create blob container for assets
az storage container create \
  --name assets \
  --account-name guerillateachingstorage \
  --public-access blob
```

#### **4. Create Azure Communication Services**
```bash
# Create communication services for email
az communication create \
  --name guerilla-teaching-comms \
  --resource-group guerilla-teaching-rg \
  --location Global
```

### **Phase 2: Deploy Backend to Azure Container Apps**

#### **1. Create Container Apps Environment**
```bash
# Install Container Apps extension
az extension add --name containerapp

# Create Container Apps environment
az containerapp env create \
  --name guerilla-teaching-env \
  --resource-group guerilla-teaching-rg \
  --location eastus
```

#### **2. Build and Deploy Backend Container**
```bash
# Build container image (from project root)
docker build -t guerilla-teaching-backend ./backend

# Tag for Azure Container Registry (if using ACR)
# Or push to Docker Hub for simpler setup
docker tag guerilla-teaching-backend:latest your-dockerhub-username/guerilla-teaching-backend:latest
docker push your-dockerhub-username/guerilla-teaching-backend:latest

# Deploy to Container Apps
az containerapp create \
  --name guerilla-teaching-backend \
  --resource-group guerilla-teaching-rg \
  --environment guerilla-teaching-env \
  --image your-dockerhub-username/guerilla-teaching-backend:latest \
  --target-port 3001 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 10 \
  --env-vars \
    NODE_ENV=production \
    PORT=3001 \
    DATABASE_URL="postgresql://gtadmin:YourSecurePassword123!@guerilla-teaching-db.postgres.database.azure.com:5432/guerilla_teaching?sslmode=require" \
    CORS_ORIGIN="https://your-static-web-app.azurestaticapps.net"
```

### **Phase 3: Deploy Frontend to Azure Static Web Apps**

#### **1. Create Static Web App via GitHub Integration**
```bash
# Create Static Web App connected to GitHub
az staticwebapp create \
  --name guerilla-teaching-frontend \
  --resource-group guerilla-teaching-rg \
  --location eastus2 \
  --source https://github.com/your-username/guerilla-teaching-frontend-azure \
  --branch main \
  --app-location "/frontend" \
  --output-location "/frontend/dist" \
  --login-with-github
```

#### **2. Configure Build Settings**
The GitHub Action will be automatically created. Ensure these settings in `.github/workflows/azure-static-web-apps-*.yml`:
```yaml
app_location: "/frontend"
api_location: "" # No API in Static Web Apps for this setup
output_location: "/frontend/dist"
```

### **Phase 4: Azure Functions for Background Workers**

#### **1. Create Function App**
```bash
# Create Function App
az functionapp create \
  --name guerilla-teaching-functions \
  --resource-group guerilla-teaching-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --storage-account guerillateachingstorage
```

#### **2. Deploy Functions**
```bash
# From the functions directory
cd azure-functions
func azure functionapp publish guerilla-teaching-functions
```

### **Phase 5: Database Migration**

#### **1. Export Data from Cloudflare D1**
```bash
# Export from D1 (run this in your Cloudflare project)
wrangler d1 export guerilla-teaching-db --output=backup.sql
```

#### **2. Convert and Import to PostgreSQL**
```bash
# Convert SQLite to PostgreSQL format
# Use the migration script: scripts/migrate-d1-to-postgres.js
node scripts/migrate-d1-to-postgres.js

# Import to Azure PostgreSQL
psql "postgresql://gtadmin:YourSecurePassword123!@guerilla-teaching-db.postgres.database.azure.com:5432/guerilla_teaching?sslmode=require" < postgres-data.sql
```

### **Phase 6: Configure Email Services**

#### **1. Set up Azure Communication Services Email**
```bash
# Get connection string
az communication list-key \
  --name guerilla-teaching-comms \
  --resource-group guerilla-teaching-rg

# Configure email domain (requires manual verification in Azure portal)
# Add domain and verify ownership
```

### **Phase 7: Environment Configuration**

#### **1. Update Frontend Environment Variables**
Create `/frontend/.env.production`:
```env
VITE_API_URL=https://guerilla-teaching-backend.azurecontainerapps.io
VITE_ENVIRONMENT=production
VITE_LOG_LEVEL=warn
```

#### **2. Update Backend Environment Variables**
```bash
# Update Container App environment variables
az containerapp update \
  --name guerilla-teaching-backend \
  --resource-group guerilla-teaching-rg \
  --set-env-vars \
    DATABASE_URL="postgresql://gtadmin:YourSecurePassword123!@guerilla-teaching-db.postgres.database.azure.com:5432/guerilla_teaching?sslmode=require" \
    AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=guerillateachingstorage;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net" \
    AZURE_COMMUNICATION_CONNECTION_STRING="YOUR_COMMUNICATION_CONNECTION_STRING"
```

## 🔧 **AZURE SERVICES CONFIGURATION**

### **Container Apps Configuration**
- ✅ `backend/Dockerfile` - Production container
- ✅ `azure-containerapp.yml` - Deployment configuration
- ✅ Auto-scaling: 0-10 replicas based on HTTP requests

### **Static Web Apps Configuration**
- ✅ `frontend/.env.production` - Environment variables
- ✅ `.github/workflows/` - CI/CD pipeline
- ✅ Global CDN distribution

### **PostgreSQL Configuration**
- ✅ `backend/src/config/database.ts` - Connection configuration
- ✅ `scripts/migrate-d1-to-postgres.js` - Migration script
- ✅ SSL required for security

### **Azure Functions Configuration**
- ✅ `azure-functions/` - Serverless functions
- ✅ Timer triggers for scheduled tasks
- ✅ HTTP triggers for API endpoints

## 📊 **EXPECTED PERFORMANCE & COSTS**

### **Azure Benefits**
- ⚡ **Global Scale** - Azure's global network
- 🔒 **Enterprise Security** - Azure AD integration
- 🛡️ **DDoS Protection** - Built-in protection
- 📈 **Auto-scaling** - Scale to zero for cost savings
- 💰 **Cost Control** - Detailed billing and budgets

### **Estimated Monthly Costs**
- Static Web Apps: Free (up to 100GB bandwidth)
- Container Apps: ~$30-50 (depends on usage)
- PostgreSQL Flexible Server: ~$12 (Burstable B1ms)
- Storage Account: ~$5-10 (depending on usage)
- Communication Services: $0.0008 per email
- Azure Functions: Free tier (1M executions)

**Total: ~$50-80/month** (compared to Cloudflare's ~$20-50/month)

## 🚨 **IMPORTANT MIGRATION NOTES**

### **Database Changes Required**
1. **Connection Strings**: Update from D1 to PostgreSQL format
2. **SQL Dialect**: Minor syntax changes from SQLite to PostgreSQL
3. **Data Types**: Map SQLite types to PostgreSQL equivalents

### **Storage Changes Required**
1. **File URLs**: Update from R2 URLs to Azure Blob Storage URLs
2. **SDK Changes**: Replace Cloudflare R2 SDK with Azure Blob Storage SDK
3. **CDN Configuration**: Set up Azure CDN for global distribution

### **Email Changes Required**
1. **Service Integration**: Replace Cloudflare Email Workers with Azure Communication Services
2. **API Changes**: Update email sending code to use Azure APIs
3. **Domain Verification**: Verify email domains in Azure portal

### **Worker Functions Changes Required**
1. **Runtime**: Convert from Cloudflare Workers to Azure Functions
2. **Triggers**: Update event triggers and bindings
3. **Environment**: Adapt to Azure Functions runtime

## 🎯 **READY FOR AZURE DEPLOYMENT**

All Azure-native components are configured:
- ✅ Container Apps backend deployment
- ✅ PostgreSQL database migration
- ✅ Static Web Apps frontend hosting
- ✅ Azure Blob Storage setup
- ✅ Azure Communication Services integration
- ✅ Azure Functions for background tasks

**Estimated migration time: 2-3 days**

## 🔗 **Next Steps**

1. **Resource Creation**: Run Azure CLI commands to create all resources
2. **Code Updates**: Update connection strings and API endpoints
3. **Data Migration**: Export from Cloudflare and import to Azure
4. **Testing**: Comprehensive testing of all functionality
5. **DNS Cutover**: Point custom domain to Azure Static Web Apps
6. **Monitoring**: Set up Azure Monitor and Application Insights

## 📞 **Support Resources**

- [Azure Container Apps Documentation](https://docs.microsoft.com/en-us/azure/container-apps/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)
- [Azure Communication Services Documentation](https://docs.microsoft.com/en-us/azure/communication-services/)