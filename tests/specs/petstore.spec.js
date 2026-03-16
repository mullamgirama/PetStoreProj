/**
 * PetStore API Tests - Refactored with Page Object Model
 * Using Allure reporting for detailed test results
 */

const { expect } = require('@playwright/test');
const { test } = require('../fixtures/apiFixtures');
const config = require('../constants/config');

test.describe('PetStore API Tests - Pet Endpoints', () => {
  let createdPetId;

  test.beforeEach(async ({ apiClient, testData }) => {
    // Generate unique pet ID for each test
    const uniquePetData = {
      id: Math.floor(Math.random() * 100000),
      ...testData.DEFAULT_PET
    };
    createdPetId = uniquePetData.id;
    
    // Store in fixture context for use in tests
    test.petData = uniquePetData;
  });

  test('POST - Create a new pet', async ({ apiClient, testData }) => {
    test.info().annotations.push({ type: 'description', description: 'Create a new pet and verify response' });
    
    const petData = {
      id: createdPetId,
      ...testData.DEFAULT_PET
    };

    const response = await apiClient.createPet(petData);

    // Assertions
    expect(response.status).toBe(200);
    expect([200, 201]).toContain(response.status);
    expect(response.ok).toBeTruthy();

    // Verify response body
    expect(response.body.id).toBe(petData.id);
    expect(response.body.name).toBe(petData.name);
    expect(response.body.status).toBe(petData.status);
  });

  test('GET - Retrieve the created pet by ID', async ({ apiClient, testData }) => {
    test.info().annotations.push({ type: 'description', description: 'Create and retrieve a pet by ID' });
    
    // First, create a pet
    const petData = {
      id: createdPetId,
      ...testData.DEFAULT_PET
    };
    await apiClient.createPet(petData);

    // Then, retrieve it
    const response = await apiClient.getPetById(createdPetId);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();

    // Verify retrieved pet matches created data
    expect(response.body.id).toBe(petData.id);
    expect(response.body.name).toBe(petData.name);
    expect(response.body.status).toBe(petData.status);
    expect(response.body.photoUrls).toEqual(petData.photoUrls);
    expect(response.body.tags).toEqual(petData.tags);
  });

  test('PUT - Update the existing pet', async ({ apiClient, testData }) => {
    test.info().annotations.push({ type: 'description', description: 'Update an existing pet and verify changes' });
    
    // First, create a pet
    const petData = {
      id: createdPetId,
      ...testData.DEFAULT_PET
    };
    await apiClient.createPet(petData);

    // Update the pet
    const updatedPetData = {
      ...petData,
      ...testData.UPDATED_PET
    };
    const updateResponse = await apiClient.updatePet(updatedPetData);

    // Assertions for update response
    expect([200, 204]).toContain(updateResponse.status);

    // Verify the update by fetching the pet again
    const getResponse = await apiClient.getPetById(createdPetId);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.name).toBe(testData.UPDATED_PET.name);
    expect(getResponse.body.status).toBe(testData.UPDATED_PET.status);
  });

  test('DELETE - Delete a pet', async ({ apiClient, testData }) => {
    test.info().annotations.push({ type: 'description', description: 'Delete a pet and verify removal' });
    
    // First, create a pet
    const petData = {
      id: createdPetId,
      ...testData.DEFAULT_PET
    };
    await apiClient.createPet(petData);

    // Delete the pet
    const deleteResponse = await apiClient.deletePet(createdPetId);
    expect([200, 204]).toContain(deleteResponse.status);

    // Try to fetch the deleted pet (should fail or return 404)
    const getResponse = await apiClient.getPetById(createdPetId);
    expect([404, 500]).toContain(getResponse.status);
  });

  test('GET - Retrieve pets by status', async ({ apiClient, testData }) => {
    test.info().annotations.push({ type: 'description', description: 'Get all available pets' });
    
    const response = await apiClient.getPetsByStatus(config.PET_STATUS.AVAILABLE);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
