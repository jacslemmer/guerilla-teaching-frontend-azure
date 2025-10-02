/**
 * Simple test to verify backend utilities are working (Effect-TS removed)
 */

import { runEffect, logInfo } from "../config/effects";
import { createSuccessResponse, dbOperation } from "./index";

// Simple test function
const testEffect = async () => {
  console.log("Testing backend utilities...");
  
  try {
    // Test basic operation execution
    const result = await runEffect(
      () => "Backend utilities are working!"
    );
    console.log("✅ Basic operation:", result);

    // Test logging
    logInfo("Test log message", { test: true });
    console.log("✅ Logging: Working");

    // Test success response creation
    const apiResponse = createSuccessResponse(
      { message: "Test data" }, 
      "Test successful"
    );
    console.log("✅ API Response:", apiResponse);

    // Test database operation simulation
    const dbResult = await dbOperation(
      async () => ({ id: "123", name: "Test User" }),
      "testDatabaseOperation"
    );
    console.log("✅ DB Operation:", dbResult);

    console.log("\n🎉 All backend utility tests passed!");
    return true;
  } catch (error) {
    console.error("❌ Backend utility test failed:", error);
    return false;
  }
};

// Export for testing
export { testEffect };

// Jest test
describe('Backend Utilities', () => {
  test('should run basic operations', async () => {
    const result = await testEffect();
    expect(result).toBe(true);
  });
});