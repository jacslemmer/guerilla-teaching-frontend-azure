/**
 * Azure Blob Storage Service
 * Replaces Cloudflare R2 storage with Azure Blob Storage
 */

import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

interface StorageService {
  uploadFile: (fileName: string, fileBuffer: Buffer, contentType: string) => Promise<string>;
  deleteFile: (fileName: string) => Promise<boolean>;
  getFileUrl: (fileName: string) => string;
  listFiles: (prefix?: string) => Promise<string[]>;
}

class AzureStorageService implements StorageService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  private containerName: string;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'assets';

    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is required');
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
  }

  async uploadFile(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

      const uploadOptions = {
        blobHTTPHeaders: {
          blobContentType: contentType,
        },
        metadata: {
          uploadedAt: new Date().toISOString(),
        },
      };

      await blockBlobClient.upload(fileBuffer, fileBuffer.length, uploadOptions);

      return this.getFileUrl(fileName);
    } catch (error) {
      console.error('Failed to upload file to Azure Blob Storage:', error);
      throw new Error(`Failed to upload file: ${fileName}`);
    }
  }

  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      const response = await blockBlobClient.deleteIfExists();
      return response.succeeded;
    } catch (error) {
      console.error('Failed to delete file from Azure Blob Storage:', error);
      return false;
    }
  }

  getFileUrl(fileName: string): string {
    const accountName = this.extractAccountName();
    return `https://${accountName}.blob.core.windows.net/${this.containerName}/${fileName}`;
  }

  async listFiles(prefix?: string): Promise<string[]> {
    try {
      const files: string[] = [];
      const listOptions = prefix ? { prefix } : undefined;

      for await (const blob of this.containerClient.listBlobsFlat(listOptions)) {
        files.push(blob.name);
      }

      return files;
    } catch (error) {
      console.error('Failed to list files from Azure Blob Storage:', error);
      return [];
    }
  }

  private extractAccountName(): string {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
    }

    const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
    if (!accountNameMatch) {
      throw new Error('Could not extract account name from connection string');
    }

    return accountNameMatch[1];
  }

  async createContainerIfNotExists(): Promise<void> {
    try {
      await this.containerClient.createIfNotExists({
        access: 'blob', // Public read access for blobs
      });
      console.log(`Container '${this.containerName}' is ready`);
    } catch (error) {
      console.error('Failed to create container:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const properties = await this.containerClient.getProperties();
      return properties !== null;
    } catch (error) {
      console.error('Azure Blob Storage health check failed:', error);
      return false;
    }
  }
}

// Create a singleton instance
let storageService: AzureStorageService | null = null;

export const getAzureStorageService = (): AzureStorageService => {
  if (!storageService) {
    storageService = new AzureStorageService();
  }
  return storageService;
};

export default AzureStorageService;