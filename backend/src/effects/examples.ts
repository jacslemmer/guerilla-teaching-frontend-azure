/**
 * Backend Examples (Temporary - Effect-TS removed)
 * 
 * Simple async/await examples replacing Effect-TS.
 * TODO: Reimplement with Effect-TS once compilation issues are resolved.
 */

import { Request, Response } from "express";
import { ApiResponse, ApiError, HttpStatus } from "@guerilla-teaching/shared-types";
import { runEffect } from "../config/effects";
import { 
  createSuccessResponse, 
  createErrorResponse, 
  dbOperation, 
  httpRequest, 
  validate,
  withFallback 
} from "./index";

// Simple User interface for examples
interface User {
  id: string;
  email: string;
  name: string;
}

// Simple user validator
const isUser = (data: unknown): data is User => {
  return typeof data === 'object' && 
         data !== null && 
         typeof (data as any).id === 'string' &&
         typeof (data as any).email === 'string' &&
         typeof (data as any).name === 'string';
};

// Example: Database user retrieval
export const getUserFromDatabase = async (userId: string): Promise<User> => {
  return await dbOperation(
    async () => {
      // Simulate database call
      await new Promise(resolve => setTimeout(resolve, 100));
      return {
        id: userId,
        email: `user${userId}@example.com`,
        name: `User ${userId}`
      };
    },
    `getUserFromDatabase(${userId})`
  );
};

// Example: External API user retrieval
export const getUserFromExternalAPI = async (userId: string): Promise<User> => {
  return await httpRequest(
    async () => {
      // Simulate external API call
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        id: userId,
        email: `external${userId}@example.com`,
        name: `External User ${userId}`
      };
    },
    `getUserFromExternalAPI(${userId})`
  );
};

// Example: User service with fallback
export const getUser = async (userId: string): Promise<ApiResponse<User>> => {
  try {
    const user = await withFallback(
      () => getUserFromDatabase(userId),
      () => getUserFromExternalAPI(userId)
    );
    return createSuccessResponse(user, "User retrieved successfully");
  } catch (error) {
    throw error;
  }
};

// Example: Express route handler
export const handleGetUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  
  if (!userId) {
    const errorResponse = createErrorResponse(
      "VALIDATION_ERROR", 
      "User ID is required", 
      HttpStatus.BAD_REQUEST
    );
    res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    return;
  }

  try {
    const result = await getUser(userId);
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    const errorResponse = createErrorResponse(
      "USER_RETRIEVAL_ERROR",
      "Failed to retrieve user", 
      HttpStatus.INTERNAL_SERVER_ERROR,
      error
    );
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};

// Example: Batch processing
export const processBatchUsers = async (userIds: string[]): Promise<ApiResponse<User[]>> => {
  try {
    const users: User[] = [];
    
    for (const userId of userIds) {
      try {
        const userResponse = await getUser(userId);
        if (userResponse.data) {
          users.push(userResponse.data);
        }
      } catch (error) {
        console.error(`Failed to process user ${userId}:`, error);
      }
    }
    
    return createSuccessResponse(users, `Processed ${users.length} users successfully`);
  } catch (error) {
    throw createErrorResponse(
      "BATCH_PROCESSING_ERROR",
      "Batch processing failed",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Example: Express route for batch processing
export const handleBatchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userIds = req.body.userIds;
    
    if (!Array.isArray(userIds)) {
      const errorResponse = createErrorResponse(
        "VALIDATION_ERROR",
        "userIds must be an array",
        HttpStatus.BAD_REQUEST
      );
      res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
      return;
    }

    const result = await processBatchUsers(userIds);
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    const errorResponse = createErrorResponse(
      "BATCH_PROCESSING_ERROR",
      "Batch processing failed",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error
    );
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};

// Export simplified examples
export const examples = {
  getUserFromDatabase,
  getUserFromExternalAPI,
  getUser,
  handleGetUser,
  processBatchUsers,
  handleBatchUsers
};