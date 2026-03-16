/**
 * Configuration constants for PetStore API tests
 */

module.exports = {
  BASE_URL: 'https://petstore.swagger.io/v2',
  TIMEOUT: 30000,
  RETRIES: 0,
  
  // Pet status constants
  PET_STATUS: {
    AVAILABLE: 'available',
    PENDING: 'pending',
    SOLD: 'sold'
  },
  
  // Request headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
