# PetStore API Testing Project

Automated API testing for PetStore Swagger API using **Playwright** with **Page Object Model** architecture, **Allure Reports**, and **Jenkins Pipeline Integration**.

## Project Structure

```
PetStoreProj/
├── tests/
│   ├── api/
│   │   └── PetStoreAPIClient.js      # API client class encapsulating all API calls
│   ├── constants/
│   │   ├── config.js                 # Configuration constants (URLs, timeouts, etc.)
│   │   └── testData.js               # Test data objects
│   ├── fixtures/
│   │   └── apiFixtures.js            # Playwright fixtures for API client injection
│   ├── specs/
│   │   └── petstore.spec.js          # Test specifications using POM
│   └── utils/
│       └── logger.js                 # Logging utility
├── playwright.config.js              # Playwright configuration with Allure reporter
├── package.json                      # Project dependencies
├── Jenkins.groovy                    # Jenkins declarative pipeline
├── .gitignore                        # Git ignore file
└── README.md                         # This file
```

## Page Object Model (POM) Architecture

The project follows the **Page Object Model** pattern adapted for API testing:

- **API Client (`PetStoreAPIClient.js`)**: Encapsulates all API interactions
  - `createPet()` - Create a new pet
  - `getPetById()` - Retrieve pet by ID
  - `updatePet()` - Update existing pet
  - `deletePet()` - Delete pet
  - `getPetsByStatus()` - Get pets by status

- **Fixtures (`apiFixtures.js`)**: Provides reusable test fixtures
  - `apiClient` - Injected API client instance
  - `testData` - Test data objects

- **Constants**: Centralized configuration and test data
  - `config.js` - API URLs, timeouts, headers
  - `testData.js` - Default pet data, status constants

## Features

✅ **Page Object Model Pattern** - Maintainable, scalable test structure  
✅ **Allure Reporting** - Detailed test reports with artifacts  
✅ **Jenkins Integration** - CI/CD pipeline ready  
✅ **Comprehensive Logging** - Debug-friendly logging utility  
✅ **Test Data Management** - Centralized test data constants  
✅ **Multiple Reporters** - HTML, JSON, JUnit, and Allure formats  

## Installation

1. **Navigate to project**
   ```bash
   cd PetStoreProj
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Generate Allure Report
```bash
npm run test:allure
```

### View Allure Report
```bash
npm run allure:report
```

### Clean all reports
```bash
npm run clean:reports
```

## Test Reports

After test execution, multiple reports are generated:

| Report Type | Location | Command |
|-------------|----------|---------|
| Playwright HTML | `playwright-report/` | Built-in |
| JSON Results | `test-results/results.json` | Built-in |
| JUnit XML | `test-results/junit.xml` | Built-in |
| Allure Report | `allure-report/` | `npm run allure:report` |

## Jenkins Pipeline

The project includes a `Jenkins.groovy` file that defines a complete CI/CD pipeline:

### Features:
- **Checkout** - Pulls code from repository
- **Install Dependencies** - Installs npm packages and Playwright browsers
- **Run Tests** - Executes test suite
- **Generate Allure Report** - Creates Allure HTML report
- **Publish Reports** - Publishes HTML, JUnit, and Allure reports
- **Post Actions** - Cleanup, archiving, and notifications

### Setup in Jenkins:

1. Create a new Pipeline job in Jenkins
2. Configure Pipeline → Definition → Pipeline script from SCM
3. Set SCM to Git and provide repository URL
4. Set Script Path to `Jenkins.groovy`
5. Configure Build Parameters (optional):
   - ENVIRONMENT: dev/staging/prod
   - GENERATE_ALLURE_REPORT: true/false

### Jenkins Parameters:
- `ENVIRONMENT`: Select test environment (dev, staging, prod)
- `GENERATE_ALLURE_REPORT`: Enable/disable Allure report generation

## Configuration

### Playwright Configuration (`playwright.config.js`)

```javascript
{
  testDir: './tests/specs',        // Test directory
  timeout: 30000,                  // Test timeout
  retries: 0,                      // Retry failed tests (2 in CI)
  workers: undefined,              // Parallel workers
  reporter: ['html', 'json', 'junit', 'allure-playwright']
}
```

### API Configuration (`tests/constants/config.js`)

```javascript
{
  BASE_URL: 'https://petstore.swagger.io/v2',
  TIMEOUT: 30000,
  PET_STATUS: { AVAILABLE, PENDING, SOLD }
}
```

## Test Examples

### Creating a Pet
```javascript
test('POST - Create a new pet', async ({ apiClient, testData }) => {
  const petData = {
    id: createdPetId,
    ...testData.DEFAULT_PET
  };
  const response = await apiClient.createPet(petData);
  expect(response.status).toBe(200);
  expect(response.body.name).toBe(petData.name);
});
```

### Getting a Pet
```javascript
test('GET - Retrieve pet by ID', async ({ apiClient }) => {
  const response = await apiClient.getPetById(petId);
  expect(response.status).toBe(200);
  expect(response.ok).toBeTruthy();
});
```

## Best Practices Implemented

1. **DRY Principle** - Centralized API client, test data, and configuration
2. **Page Object Model** - Clean separation of concerns
3. **Fixture Injection** - Reusable components via Playwright fixtures
4. **Logging** - Comprehensive logging for debugging
5. **Error Handling** - Graceful error handling in API calls
6. **Test Isolation** - Each test is independent
7. **Scalability** - Easy to extend with new test cases
8. **Reporting** - Multiple report formats for different audiences

## Troubleshooting

### Tests failing with 404
- Verify the API is accessible at the BASE_URL
- Check network connectivity to petstore.swagger.io

### Allure report not generating
- Ensure `allure-commandline` is installed: `npm install`
- Check `allure-results` directory exists after test run
- Run: `npm run allure:report`

### Jenkins pipeline fails
- Verify Node.js and npm are installed on Jenkins agent
- Check Jenkins has internet access for npm packages
- Ensure Allure plugin is installed in Jenkins (optional)

## License

ISC

## Contributing

1. Create a new branch for your feature
2. Add tests in `tests/specs/`
3. Update API client if needed
4. Run `npm test` to verify
5. Submit a pull request

## Support

For issues, questions, or improvements, please open an issue in the repository.

API documentation: https://petstore.swagger.io/
