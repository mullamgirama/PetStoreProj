# POM Architecture Setup Guide

## Overview

This document explains the Page Object Model (POM) architecture used in this project for API testing.

## Directory Structure Explained

### `/tests/api/` - API Abstraction Layer
Contains all API client classes that encapsulate API interactions.

**PetStoreAPIClient.js**
- Encapsulates all API endpoints
- Methods return consistent response objects with format: `{ status, body, ok }`
- Handles error responses gracefully
- All API calls are logged for debugging

### `/tests/fixtures/` - Playwright Fixtures
Provides dependency injection for tests.

**apiFixtures.js**
- Extends Playwright's test fixture
- Injects `apiClient` - PetStoreAPIClient instance
- Injects `testData` - Common test data objects
- Can be extended with new fixtures

### `/tests/constants/` - Configuration & Data
Centralized configuration and test data.

**config.js**
- API base URLs
- Timeouts and retry settings
- Headers and authentication info
- Status constants

**testData.js**
- Default pet data templates
- Test data variations
- Constants for different scenarios

### `/tests/utils/` - Utilities
Helper functions and utilities.

**logger.js**
- Centralized logging
- Consistent log levels (info, error, warn, debug)
- Integration with test reports

### `/tests/specs/` - Test Specifications
Test files that follow Arrange-Act-Assert pattern.

**petstore.spec.js**
- Uses fixtures for dependency injection
- Uses API client for all interactions
- Uses test data from constants
- Clear test descriptions
- Proper before/after hooks

## How to Add New Tests

### 1. Add Test Data (if needed)
Update `tests/constants/testData.js`:

```javascript
MY_NEW_TEST_DATA: {
  property1: 'value1',
  property2: 'value2'
}
```

### 2. Add API Method (if needed)
Update `tests/api/PetStoreAPIClient.js`:

```javascript
async myNewMethod(data) {
  logger.info('Calling my new method:', data);
  const response = await this.request.post(`${this.baseURL}/endpoint`, {
    data: data,
    headers: config.HEADERS
  });
  
  return {
    status: response.status(),
    body: await response.json(),
    ok: response.ok()
  };
}
```

### 3. Add Test Case
Update `tests/specs/petstore.spec.js`:

```javascript
test('My New Test', async ({ apiClient, testData }) => {
  test.info().annotations.push({ 
    type: 'description', 
    description: 'Test description' 
  });
  
  const response = await apiClient.myNewMethod(testData.MY_NEW_TEST_DATA);
  
  expect(response.status).toBe(200);
  expect(response.body.property).toBe('expectedValue');
});
```

## Benefits of POM Architecture

### ✅ Maintainability
- Changes to API calls only in one place (PetStoreAPIClient.js)
- Test files remain clean and focused on test logic

### ✅ Reusability
- Fixtures provide reusable components
- Test data is centralized
- Logger utility used across tests

### ✅ Scalability
- Easy to add new test cases
- Easy to add new API methods
- Clear structure for new developers

### ✅ Readability
- Tests read like specification documents
- Clear separation of concerns
- Consistent naming conventions

### ✅ Debuggability
- Comprehensive logging at every step
- Centralized configuration for easy troubleshooting
- Consistent response object format

## Test Execution Flow

```
Test Suite
├── beforeEach Hook
│   └── Generate unique test data
├── Test Case
│   ├── Arrange: Prepare test data
│   ├── Act: Call API method via apiClient
│   └── Assert: Verify response
├── afterEach Hook (if defined)
│   └── Cleanup (optional)
└── Report Generation
    └── HTML, JSON, JUnit, Allure
```

## Response Object Format

All API methods return a consistent response object:

```javascript
{
  status: 200,              // HTTP status code
  body: { /* response */ }, // Parsed JSON response
  ok: true                  // Boolean indication of success (2xx)
}
```

This allows tests to be simple and consistent:

```javascript
const response = await apiClient.createPet(petData);
expect(response.status).toBe(200);
expect(response.ok).toBeTruthy();
expect(response.body.id).toBe(petData.id);
```

## Configuration Hierarchy

```
Command Line Parameters
│
Environment Variables
│
tests/constants/config.js
│
playwright.config.js
```

## Integration with CI/CD

### Jenkins
- Jenkins.groovy pipeline orchestrates the entire flow
- Generates all reports
- Publishes results to Jenkins UI
- Supports parameterized builds

### GitHub Actions
- Can be triggered on push/PR
- Runs tests in parallel
- Generates artifacts
- Posts reports as comments

## Best Practices

1. **Always use the API Client**: Don't make direct API calls in tests
2. **Use fixtures for injection**: Keep tests clean
3. **Centralize data**: Use constants directory for all test data
4. **Log everything**: Use logger for debugging
5. **One assertion focus per test**: Tests should be simple and focused
6. **Use descriptive names**: Test names should explain what they test
7. **Keep tests independent**: No test should depend on another test

## Troubleshooting

### Tests fail with API not found
- Check `tests/constants/config.js` BASE_URL
- Verify network connectivity
- Check if API is running

### Cannot find module
- Run `npm install`
- Check file paths in imports
- Verify directory structure

### Fixtures not working
- Ensure fixtures.js exports test correctly
- Check that test files use correct import: `const { test } = require('../fixtures/apiFixtures')`
- Verify fixture names match usage in tests

## Next Steps

1. Add more API endpoints to PetStoreAPIClient
2. Create additional test suites for other API resources
3. Implement custom reporters
4. Add performance testing
5. Implement visual regression testing
