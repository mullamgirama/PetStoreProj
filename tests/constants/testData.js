/**
 * Test data for PetStore API tests
 */

module.exports = {
  // Default pet data
  DEFAULT_PET: {
    name: 'Fluffy',
    photoUrls: ['https://example.com/fluffy.jpg'],
    status: 'available',
    tags: [
      {
        id: 1,
        name: 'popular'
      }
    ]
  },
  
  UPDATED_PET: {
    name: 'FluffyUpdated',
    status: 'sold'
  },
  
  DELETE_PET: {
    name: 'ToDelete',
    photoUrls: ['https://example.com/delete.jpg'],
    status: 'available'
  }
};
