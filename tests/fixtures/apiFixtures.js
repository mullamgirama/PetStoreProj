/**
 * Playwright fixtures for API testing
 * Provides reusable api client and test data
 */

const { test: baseTest } = require('@playwright/test');
const PetStoreAPIClient = require('../api/PetStoreAPIClient');
const testData = require('../constants/testData');

/**
 * Extended test fixture with PetStore API client
 */
const test = baseTest.extend({
  // Inject PetStoreAPIClient for each test
  apiClient: async ({ request }, use) => {
    const client = new PetStoreAPIClient(request);
    await use(client);
  },
  
  // Provide test data
  testData: testData
});

module.exports = { test };
