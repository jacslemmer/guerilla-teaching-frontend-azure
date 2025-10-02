/**
 * Quote API Routes
 * RESTful endpoints for quote operations (simplified)
 */

import express from 'express';
import { 
  CreateQuoteRequest, 
  QuoteResponse, 
  Quote 
} from '@guerilla-teaching/shared-types';
import { QuoteModel, CreateQuoteParams } from '../models/Quote';
import { quoteRepository } from '../repositories/QuoteRepository';
import { emailService } from '../services/emailService';

const router = express.Router();

/**
 * POST /quotes
 * Create a new quote
 * Body: CreateQuoteRequest
 * Returns: QuoteResponse
 */
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new quote...');
    
    // Validate request body
    const createRequest = req.body as CreateQuoteRequest;
    
    if (!createRequest.items || !Array.isArray(createRequest.items) || createRequest.items.length === 0) {
      return res.status(400).json(
        QuoteModel.createErrorResponse("Quote must have at least one item")
      );
    }
    
    if (!createRequest.customer) {
      return res.status(400).json(
        QuoteModel.createErrorResponse("Customer information is required")
      );
    }

    // Get existing references for uniqueness
    const existingReferences = await quoteRepository.getExistingReferences();

    // Create quote parameters
    const quoteParams: CreateQuoteParams = {
      items: createRequest.items,
      customer: createRequest.customer,
      comments: createRequest.comments,
      currency: 'ZAR' // Default currency
    };

    // Create the quote using the model
    const newQuote = QuoteModel.createQuote(quoteParams, existingReferences);

    // Save to database
    const savedQuote = await quoteRepository.create(newQuote);

    console.log(`✅ Quote created successfully: ${savedQuote.referenceNumber}`);

    // Send email notification to back office
    try {
      await emailService.sendQuoteNotification(savedQuote);
      console.log(`📧 Email notification sent for quote: ${savedQuote.referenceNumber}`);
    } catch (emailError) {
      console.warn(`⚠️ Failed to send email notification for quote ${savedQuote.referenceNumber}:`, emailError);
      // Don't fail the quote creation if email fails
    }

    // Return success response
    const response = QuoteModel.createSuccessResponse(savedQuote);
    return res.status(201).json(response);

  } catch (error) {
    console.error('❌ Error creating quote:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const response = QuoteModel.createErrorResponse(errorMessage);
    
    return res.status(500).json(response);
  }
});

/**
 * GET /quotes/:reference
 * Get quote by reference number
 * Params: reference (string) - Quote reference number
 * Returns: QuoteResponse
 */
router.get('/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    console.log(`🔍 Looking up quote: ${reference}`);
    
    if (!reference) {
      return res.status(400).json(
        QuoteModel.createErrorResponse("Reference number is required")
      );
    }

    // Validate reference format (GT-YYYY-NNNN)
    const referencePattern = /^GT-\d{4}-\d{4}$/;
    if (!referencePattern.test(reference)) {
      return res.status(400).json(
        QuoteModel.createErrorResponse("Invalid reference number format. Expected: GT-YYYY-NNNN")
      );
    }

    // Find quote by reference
    const quote = await quoteRepository.findByReference(reference);

    if (!quote) {
      console.log(`❌ Quote not found: ${reference}`);
      return res.status(404).json(
        QuoteModel.createErrorResponse("Quote not found")
      );
    }

    console.log(`✅ Quote found: ${reference}`);

    // Return success response
    const response = QuoteModel.createSuccessResponse(quote);
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error retrieving quote:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const response = QuoteModel.createErrorResponse(errorMessage);
    
    return res.status(500).json(response);
  }
});

/**
 * GET /quotes
 * Get all quotes (admin/internal use)
 * Query params: limit (number), offset (number)
 * Returns: Array of quotes
 */
router.get('/', async (req, res) => {
  try {
    console.log('📋 Retrieving all quotes...');
    
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100"
      });
    }

    if (offset < 0) {
      return res.status(400).json({
        success: false,
        message: "Offset must be non-negative"
      });
    }

    // Get quotes with pagination
    const quotes = await quoteRepository.getAllQuotes(limit, offset);

    console.log(`✅ Retrieved ${quotes.length} quotes`);

    return res.status(200).json({
      success: true,
      quotes,
      pagination: {
        limit,
        offset,
        count: quotes.length
      }
    });

  } catch (error) {
    console.error('❌ Error retrieving quotes:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
});

/**
 * PATCH /quotes/:id/status
 * Update quote status (admin/internal use)
 * Params: id (string) - Quote ID
 * Body: { status: 'pending' | 'approved' | 'rejected' | 'expired' }
 * Returns: QuoteResponse
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`🔄 Updating quote status: ${id} -> ${status}`);
    
    if (!id) {
      return res.status(400).json(
        QuoteModel.createErrorResponse("Quote ID is required")
      );
    }

    if (!status || !['pending', 'approved', 'rejected', 'expired'].includes(status)) {
      return res.status(400).json(
        QuoteModel.createErrorResponse("Valid status is required: pending, approved, rejected, or expired")
      );
    }

    // Update quote status
    const updatedQuote = await quoteRepository.updateStatus(id, status);

    if (!updatedQuote) {
      return res.status(404).json(
        QuoteModel.createErrorResponse("Quote not found")
      );
    }

    console.log(`✅ Quote status updated: ${id} -> ${status}`);

    // Return success response
    const response = QuoteModel.createSuccessResponse(updatedQuote);
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error updating quote status:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const response = QuoteModel.createErrorResponse(errorMessage);
    
    return res.status(500).json(response);
  }
});

/**
 * DELETE /quotes/:id
 * Delete a quote (admin/testing use only)
 * Params: id (string) - Quote ID
 * Returns: Success confirmation
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ Deleting quote: ${id}`);
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Quote ID is required"
      });
    }

    // Delete quote
    const deleted = await quoteRepository.deleteQuote(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Quote not found"
      });
    }

    console.log(`✅ Quote deleted: ${id}`);

    return res.status(200).json({
      success: true,
      message: "Quote deleted successfully"
    });

  } catch (error) {
    console.error('❌ Error deleting quote:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
});

/**
 * GET /quotes/health
 * Health check endpoint for quote services
 * Returns: Service status
 */
router.get('/health', async (req, res) => {
  try {
    // Test database connection by getting reference count
    const references = await quoteRepository.getExistingReferences();

    return res.status(200).json({
      success: true,
      service: 'quotes',
      status: 'healthy',
      databaseConnected: true,
      quotesCount: references.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Quote service health check failed:', error);
    
    return res.status(503).json({
      success: false,
      service: 'quotes',
      status: 'unhealthy',
      databaseConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;