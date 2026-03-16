/**
 * PetStore API Client - Handles all API interactions
 * Using Page Object Model pattern for API testing
 */

const config = require('../constants/config');
const logger = require('../utils/logger');

class PetStoreAPIClient {
  constructor(request) {
    this.request = request;
    this.baseURL = config.BASE_URL;
  }

  /**
   * Create a new pet
   * @param {Object} petData - Pet data object
   * @returns {Promise<Object>} - API response
   */
  async createPet(petData) {
    logger.info('Creating pet with data:', petData);
    
    const response = await this.request.post(`${this.baseURL}/pet`, {
      data: petData,
      headers: config.HEADERS
    });

    logger.info('Create pet response status:', response.status());
    const responseBody = await response.json();
    logger.debug('Create pet response body:', responseBody);
    
    return {
      status: response.status(),
      body: responseBody,
      ok: response.ok()
    };
  }

  /**
   * Get pet by ID
   * @param {number} petId - Pet ID
   * @returns {Promise<Object>} - API response
   */
  async getPetById(petId) {
    logger.info('Fetching pet with ID:', petId);
    
    const response = await this.request.get(`${this.baseURL}/pet/${petId}`);

    logger.info('Get pet response status:', response.status());
    const responseBody = await response.json();
    logger.debug('Get pet response body:', responseBody);
    
    return {
      status: response.status(),
      body: responseBody,
      ok: response.ok()
    };
  }

  /**
   * Update an existing pet
   * @param {Object} petData - Updated pet data object
   * @returns {Promise<Object>} - API response
   */
  async updatePet(petData) {
    logger.info('Updating pet with data:', petData);
    
    const response = await this.request.put(`${this.baseURL}/pet`, {
      data: petData,
      headers: config.HEADERS
    });

    logger.info('Update pet response status:', response.status());
    let responseBody;
    try {
      responseBody = await response.json();
      logger.debug('Update pet response body:', responseBody);
    } catch (e) {
      responseBody = null;
    }
    
    return {
      status: response.status(),
      body: responseBody,
      ok: response.ok()
    };
  }

  /**
   * Delete pet by ID
   * @param {number} petId - Pet ID
   * @returns {Promise<Object>} - API response
   */
  async deletePet(petId) {
    logger.info('Deleting pet with ID:', petId);
    
    const response = await this.request.delete(`${this.baseURL}/pet/${petId}`);

    logger.info('Delete pet response status:', response.status());
    let responseBody;
    try {
      responseBody = await response.json();
    } catch (e) {
      responseBody = null;
    }
    
    return {
      status: response.status(),
      body: responseBody,
      ok: response.ok()
    };
  }

  /**
   * Get pets by status
   * @param {string} status - Pet status
   * @returns {Promise<Object>} - API response
   */
  async getPetsByStatus(status) {
    logger.info('Fetching pets by status:', status);
    
    const response = await this.request.get(
      `${this.baseURL}/pet/findByStatus?status=${status}`
    );

    logger.info('Get pets by status response status:', response.status());
    const responseBody = await response.json();
    logger.debug('Get pets by status response body:', responseBody);
    
    return {
      status: response.status(),
      body: responseBody,
      ok: response.ok()
    };
  }
}

module.exports = PetStoreAPIClient;
