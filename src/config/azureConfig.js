// src/config/azureConfig.js
// Azure Face API Configuration
// Replace these values with your actual Azure Face API credentials

export const AZURE_FACE_CONFIG = {
  // Your Azure Face API endpoint (replace YOUR_REGION with your actual region)
  // Example regions: eastus, westus2, centralus, northeurope, etc.
  ENDPOINT: 'https://YOUR_REGION.api.cognitive.microsoft.com',
  
  // Your Azure Face API subscription key
  // Get this from Azure Portal > Cognitive Services > Face > Keys and Endpoint
  SUBSCRIPTION_KEY: 'YOUR_AZURE_SUBSCRIPTION_KEY',
  
  // API version (usually don't need to change this)
  API_VERSION: 'v1.0',
  
  // Person Group ID - unique identifier for your student group
  // This should be lowercase, no spaces, and unique to your application
  PERSON_GROUP_ID: 'student-portal-group',
  
  // Confidence threshold for face verification (0.0 to 1.0)
  // Higher values mean stricter matching
  CONFIDENCE_THRESHOLD: 0.5,
  
  // Maximum number of faces to return in identification
  MAX_CANDIDATES: 1,
  
  // Training timeout in seconds
  TRAINING_TIMEOUT: 30,
};

// Environment-specific configurations
export const ENVIRONMENTS = {
  development: {
    ...AZURE_FACE_CONFIG,
    PERSON_GROUP_ID: 'student-portal-dev',
    CONFIDENCE_THRESHOLD: 0.4, // Lower threshold for testing
  },
  
  production: {
    ...AZURE_FACE_CONFIG,
    PERSON_GROUP_ID: 'student-portal-prod',
    CONFIDENCE_THRESHOLD: 0.6, // Higher threshold for production
  },
  
  testing: {
    ...AZURE_FACE_CONFIG,
    PERSON_GROUP_ID: 'student-portal-test',
    CONFIDENCE_THRESHOLD: 0.3, // Lowest threshold for testing
  }
};

// Get configuration based on current environment
export const getCurrentConfig = () => {
  const env = __DEV__ ? 'development' : 'production';
  return ENVIRONMENTS[env] || AZURE_FACE_CONFIG;
};

// Validation function to check if configuration is complete
export const validateConfig = (config = getCurrentConfig()) => {
  const errors = [];
  
  if (!config.ENDPOINT || config.ENDPOINT.includes('YOUR_REGION')) {
    errors.push('ENDPOINT must be set with your actual Azure region');
  }
  
  if (!config.SUBSCRIPTION_KEY || config.SUBSCRIPTION_KEY === 'YOUR_AZURE_SUBSCRIPTION_KEY') {
    errors.push('SUBSCRIPTION_KEY must be set with your actual Azure Face API key');
  }
  
  if (!config.PERSON_GROUP_ID) {
    errors.push('PERSON_GROUP_ID must be set');
  }
  
  if (config.CONFIDENCE_THRESHOLD < 0 || config.CONFIDENCE_THRESHOLD > 1) {
    errors.push('CONFIDENCE_THRESHOLD must be between 0 and 1');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default getCurrentConfig();