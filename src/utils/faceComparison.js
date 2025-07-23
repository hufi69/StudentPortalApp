// src/utils/faceComparison.js
import * as FileSystem from 'expo-file-system';
import azureFaceAPI from '../api/azureFaceAPI';

/**
 * Compare Faces with Azure Face API
 * This is the main function you requested for comparing two face images
 * 
 * @param {string} referenceImageUri - URI of the reference image
 * @param {string} newImageUri - URI of the new image to compare
 * @returns {Promise<boolean>} - Returns true if faces match with confidence > 0.5
 */
export const compareFaces = async (referenceImageUri, newImageUri) => {
  try {
    // Use the Azure Face API to compare faces
    const result = await azureFaceAPI.compareFaces(referenceImageUri, newImageUri);
    
    // Return true if confidence is above threshold (0.5)
    return result.confidence > 0.5;
  } catch (error) {
    console.error('Face comparison error:', error);
    throw error;
  }
};

/**
 * Enhanced face comparison with detailed results
 * 
 * @param {string} referenceImageUri - URI of the reference image
 * @param {string} newImageUri - URI of the new image to compare
 * @param {number} confidenceThreshold - Custom confidence threshold (default: 0.5)
 * @returns {Promise<Object>} - Detailed comparison result
 */
export const compareFacesDetailed = async (referenceImageUri, newImageUri, confidenceThreshold = 0.5) => {
  try {
    const result = await azureFaceAPI.compareFaces(referenceImageUri, newImageUri);
    
    return {
      isMatch: result.confidence > confidenceThreshold,
      confidence: result.confidence,
      threshold: confidenceThreshold,
      isIdentical: result.isIdentical,
      referenceFaceData: result.referenceFace,
      newFaceData: result.newFace,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Detailed face comparison error:', error);
    throw error;
  }
};

/**
 * Batch face comparison - compare one reference image against multiple images
 * 
 * @param {string} referenceImageUri - URI of the reference image
 * @param {string[]} imageUris - Array of image URIs to compare against
 * @param {number} confidenceThreshold - Custom confidence threshold (default: 0.5)
 * @returns {Promise<Array>} - Array of comparison results
 */
export const batchCompareFaces = async (referenceImageUri, imageUris, confidenceThreshold = 0.5) => {
  try {
    const results = [];
    
    for (let i = 0; i < imageUris.length; i++) {
      try {
        const result = await compareFacesDetailed(referenceImageUri, imageUris[i], confidenceThreshold);
        results.push({
          index: i,
          imageUri: imageUris[i],
          ...result
        });
      } catch (error) {
        results.push({
          index: i,
          imageUri: imageUris[i],
          error: error.message,
          isMatch: false,
          confidence: 0
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Batch face comparison error:', error);
    throw error;
  }
};

/**
 * Verify user identity using stored reference image
 * 
 * @param {string} userId - User ID to verify against
 * @param {string} newImageUri - URI of the new image to verify
 * @returns {Promise<Object>} - Verification result
 */
export const verifyUserIdentity = async (userId, newImageUri) => {
  try {
    const result = await azureFaceAPI.verifyUserIdentity(userId, newImageUri);
    return result;
  } catch (error) {
    console.error('User identity verification error:', error);
    throw error;
  }
};

/**
 * Register user face for future comparisons
 * 
 * @param {string} userId - Unique user identifier
 * @param {string} userName - User's display name
 * @param {string} imageUri - URI of the user's face image
 * @returns {Promise<Object>} - Registration result
 */
export const registerUserFace = async (userId, userName, imageUri) => {
  try {
    const result = await azureFaceAPI.registerUserWithFace(userId, userName, imageUri);
    return result;
  } catch (error) {
    console.error('User face registration error:', error);
    throw error;
  }
};

/**
 * Check if user is already registered for face recognition
 * 
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} - True if user is registered
 */
export const isUserRegistered = async (userId) => {
  try {
    return await azureFaceAPI.isUserRegistered(userId);
  } catch (error) {
    console.error('User registration check error:', error);
    return false;
  }
};

/**
 * Detect faces in an image
 * 
 * @param {string} imageUri - URI of the image to analyze
 * @returns {Promise<Array>} - Array of detected faces with attributes
 */
export const detectFaces = async (imageUri) => {
  try {
    const faces = await azureFaceAPI.detectFaces(imageUri);
    return faces;
  } catch (error) {
    console.error('Face detection error:', error);
    throw error;
  }
};

/**
 * Validate image quality for face recognition
 * 
 * @param {string} imageUri - URI of the image to validate
 * @returns {Promise<Object>} - Validation result with recommendations
 */
export const validateImageQuality = async (imageUri) => {
  try {
    const faces = await detectFaces(imageUri);
    
    const validation = {
      isValid: false,
      faceCount: faces.length,
      issues: [],
      recommendations: []
    };
    
    if (faces.length === 0) {
      validation.issues.push('No faces detected');
      validation.recommendations.push('Ensure your face is clearly visible');
      validation.recommendations.push('Improve lighting conditions');
    } else if (faces.length > 1) {
      validation.issues.push('Multiple faces detected');
      validation.recommendations.push('Ensure only one face is visible in the image');
    } else {
      const face = faces[0];
      validation.isValid = true;
      
      // Check face attributes if available
      if (face.faceAttributes) {
        if (face.faceAttributes.blur && face.faceAttributes.blur.blurLevel === 'high') {
          validation.issues.push('Image is too blurry');
          validation.recommendations.push('Take a clearer photo');
        }
        
        if (face.faceAttributes.exposure && face.faceAttributes.exposure.exposureLevel !== 'goodExposure') {
          validation.issues.push('Poor lighting conditions');
          validation.recommendations.push('Improve lighting for better recognition');
        }
      }
      
      // Check face rectangle size (face should be reasonably large)
      const faceRect = face.faceRectangle;
      if (faceRect && (faceRect.width < 100 || faceRect.height < 100)) {
        validation.issues.push('Face is too small in the image');
        validation.recommendations.push('Move closer to the camera');
      }
    }
    
    validation.isValid = validation.issues.length === 0;
    
    return validation;
  } catch (error) {
    console.error('Image quality validation error:', error);
    return {
      isValid: false,
      faceCount: 0,
      issues: ['Failed to analyze image'],
      recommendations: ['Please try again with a different image'],
      error: error.message
    };
  }
};

/**
 * Convert image to base64 (utility function)
 * 
 * @param {string} imageUri - URI of the image to convert
 * @returns {Promise<string>} - Base64 encoded image
 */
export const imageToBase64 = async (imageUri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Image to base64 conversion error:', error);
    throw new Error('Failed to process image');
  }
};

/**
 * Get face comparison statistics
 * 
 * @param {Array} comparisonResults - Array of comparison results
 * @returns {Object} - Statistics summary
 */
export const getFaceComparisonStats = (comparisonResults) => {
  if (!Array.isArray(comparisonResults) || comparisonResults.length === 0) {
    return {
      total: 0,
      matches: 0,
      nonMatches: 0,
      averageConfidence: 0,
      highestConfidence: 0,
      lowestConfidence: 0
    };
  }
  
  const validResults = comparisonResults.filter(result => !result.error && typeof result.confidence === 'number');
  const matches = validResults.filter(result => result.isMatch);
  const confidenceValues = validResults.map(result => result.confidence);
  
  return {
    total: comparisonResults.length,
    matches: matches.length,
    nonMatches: validResults.length - matches.length,
    errors: comparisonResults.length - validResults.length,
    averageConfidence: confidenceValues.length > 0 ? 
      confidenceValues.reduce((sum, conf) => sum + conf, 0) / confidenceValues.length : 0,
    highestConfidence: confidenceValues.length > 0 ? Math.max(...confidenceValues) : 0,
    lowestConfidence: confidenceValues.length > 0 ? Math.min(...confidenceValues) : 0
  };
};

// Export all functions
export default {
  compareFaces,
  compareFacesDetailed,
  batchCompareFaces,
  verifyUserIdentity,
  registerUserFace,
  isUserRegistered,
  detectFaces,
  validateImageQuality,
  imageToBase64,
  getFaceComparisonStats
};