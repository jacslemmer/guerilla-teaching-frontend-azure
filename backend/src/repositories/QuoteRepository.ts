/**
 * Quote Repository
 * Data access layer for quote operations using repository pattern (simplified)
 */

import { Quote } from '@guerilla-teaching/shared-types';
import { QuoteModel, QuoteEntity } from '../models/Quote';
import { DatabaseService, createDatabaseService } from '../config/database';

// Repository service interface
export interface QuoteRepositoryService {
  create: (quote: Quote) => Promise<Quote>;
  findByReference: (referenceNumber: string) => Promise<Quote | null>;
  findById: (id: string) => Promise<Quote | null>;
  updateStatus: (id: string, status: Quote['status']) => Promise<Quote | null>;
  getExistingReferences: () => Promise<string[]>;
  getAllQuotes: (limit?: number, offset?: number) => Promise<Quote[]>;
  deleteQuote: (id: string) => Promise<boolean>;
}

// Implementation of quote repository
export class QuoteRepository implements QuoteRepositoryService {
  private db: DatabaseService;

  constructor() {
    this.db = createDatabaseService();
  }

  /**
   * Create a new quote in the database
   * @param quote Quote object to store
   * @returns Created quote
   */
  async create(quote: Quote): Promise<Quote> {
    try {
      const entity = QuoteModel.toEntity(quote);
      await this.db.createQuote(entity);
      return quote;
    } catch (error) {
      throw new Error(`Failed to create quote: ${error}`);
    }
  }

  /**
   * Find quote by reference number
   * @param referenceNumber Quote reference to search for
   * @returns Quote or null if not found
   */
  async findByReference(referenceNumber: string): Promise<Quote | null> {
    try {
      const entity = await this.db.findQuoteByReference(referenceNumber);
      if (!entity) {
        return null;
      }
      return QuoteModel.fromEntity(entity);
    } catch (error) {
      throw new Error(`Failed to find quote by reference: ${error}`);
    }
  }

  /**
   * Find quote by ID
   * @param id Quote ID to search for
   * @returns Quote or null if not found
   */
  async findById(id: string): Promise<Quote | null> {
    try {
      const entity = await this.db.findQuoteById(id);
      if (!entity) {
        return null;
      }
      return QuoteModel.fromEntity(entity);
    } catch (error) {
      throw new Error(`Failed to find quote by ID: ${error}`);
    }
  }

  /**
   * Update quote status
   * @param id Quote ID
   * @param status New status
   * @returns Updated quote or null if not found
   */
  async updateStatus(id: string, status: Quote['status']): Promise<Quote | null> {
    try {
      const entity = await this.db.updateQuoteStatus(id, status);
      if (!entity) {
        return null;
      }
      return QuoteModel.fromEntity(entity);
    } catch (error) {
      throw new Error(`Failed to update quote status: ${error}`);
    }
  }

  /**
   * Get all existing reference numbers for uniqueness checking
   * @returns Array of reference numbers
   */
  async getExistingReferences(): Promise<string[]> {
    try {
      return await this.db.getAllReferences();
    } catch (error) {
      throw new Error(`Failed to get existing references: ${error}`);
    }
  }

  /**
   * Get all quotes with pagination
   * @param limit Maximum number of quotes to return
   * @param offset Number of quotes to skip
   * @returns Array of quotes
   */
  async getAllQuotes(limit = 50, offset = 0): Promise<Quote[]> {
    try {
      const entities = await this.db.getAllQuotes(limit, offset);
      return entities.map(entity => QuoteModel.fromEntity(entity));
    } catch (error) {
      throw new Error(`Failed to get all quotes: ${error}`);
    }
  }

  /**
   * Delete a quote (for testing/admin purposes)
   * @param id Quote ID to delete
   * @returns Success boolean
   */
  async deleteQuote(id: string): Promise<boolean> {
    try {
      return await this.db.deleteQuote(id);
    } catch (error) {
      throw new Error(`Failed to delete quote: ${error}`);
    }
  }
}

// Singleton instance for the application
export const quoteRepository = new QuoteRepository();