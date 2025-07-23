// src/examples/faceComparisonExample.js
// Example usage of Azure Face API integration

import { compareFaces, compareFacesDetailed, registerUserFace, verifyUserIdentity } from '../utils/faceComparison';

/**
 * Example 1: Basic Face Comparison
 * Compare two face images and get a simple true/false result
 */
export const basicFaceComparisonExample = async () => {
  try {
    const referenceImageUri = 'file:///path/to/reference/image.jpg';
    const newImageUri = 'file:///path/to/new/image.jpg';
    
    // This is the main function you requested
    const isMatch = await compareFaces(referenceImageUri, newImageUri);
    
    console.log('Faces match:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Face comparison failed:', error.message);
    return false;
  }
};

/**
 * Example 2: Detailed Face Comparison
 * Get detailed results including confidence score
 */
export const detailedFaceComparisonExample = async () => {
  try {
    const referenceImageUri = 'file:///path/to/reference/image.jpg';
    const newImageUri = 'file:///path/to/new/image.jpg';
    
    const result = await compareFacesDetailed(referenceImageUri, newImageUri, 0.6); // Custom threshold
    
    console.log('Detailed comparison result:', {
      isMatch: result.isMatch,
      confidence: result.confidence,
      threshold: result.threshold,
      isIdentical: result.isIdentical
    });
    
    return result;
  } catch (error) {
    console.error('Detailed face comparison failed:', error.message);
    return null;
  }
};

/**
 * Example 3: User Registration and Verification Flow
 * Complete flow for registering a user and then verifying them
 */
export const userRegistrationAndVerificationExample = async () => {
  try {
    const userId = 'student123';
    const userName = 'John Doe';
    const registrationImageUri = 'file:///path/to/registration/image.jpg';
    const verificationImageUri = 'file:///path/to/verification/image.jpg';
    
    // Step 1: Register user with their face
    console.log('Registering user...');
    const registrationResult = await registerUserFace(userId, userName, registrationImageUri);
    
    if (registrationResult.success) {
      console.log('User registered successfully:', registrationResult.message);
      
      // Step 2: Verify user identity
      console.log('Verifying user identity...');
      const verificationResult = await verifyUserIdentity(userId, verificationImageUri);
      
      if (verificationResult.success) {
        console.log('User verified successfully:', {
          confidence: verificationResult.confidence,
          message: verificationResult.message
        });
        return true;
      } else {
        console.log('User verification failed:', verificationResult.message);
        return false;
      }
    } else {
      console.log('User registration failed');
      return false;
    }
  } catch (error) {
    console.error('Registration/Verification flow failed:', error.message);
    return false;
  }
};

/**
 * Example 4: Using with Camera/Image Picker
 * Practical example of how to use with captured images
 */
export const cameraIntegrationExample = async (capturedImageUri) => {
  try {
    // Assuming you have a reference image stored somewhere
    const storedReferenceImageUri = 'file:///path/to/stored/reference.jpg';
    
    // Compare the captured image with the stored reference
    const result = await compareFacesDetailed(storedReferenceImageUri, capturedImageUri);
    
    if (result.isMatch) {
      console.log(`Face recognized with ${(result.confidence * 100).toFixed(1)}% confidence`);
      return {
        success: true,
        message: 'Face recognized successfully',
        confidence: result.confidence
      };
    } else {
      console.log(`Face not recognized. Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      return {
        success: false,
        message: 'Face not recognized',
        confidence: result.confidence
      };
    }
  } catch (error) {
    console.error('Camera integration example failed:', error.message);
    return {
      success: false,
      message: error.message,
      confidence: 0
    };
  }
};

/**
 * Example 5: Attendance System Integration
 * How to integrate face comparison with an attendance system
 */
export const attendanceSystemExample = async (studentId, capturedImageUri) => {
  try {
    // Verify student identity
    const verificationResult = await verifyUserIdentity(studentId, capturedImageUri);
    
    if (verificationResult.success) {
      // Mark attendance
      const attendanceRecord = {
        studentId,
        timestamp: new Date().toISOString(),
        method: 'face_recognition',
        confidence: verificationResult.confidence,
        status: 'present'
      };
      
      // Here you would save to your database or local storage
      console.log('Attendance marked:', attendanceRecord);
      
      return {
        success: true,
        message: 'Attendance marked successfully',
        record: attendanceRecord
      };
    } else {
      console.log('Attendance marking failed - identity not verified');
      return {
        success: false,
        message: 'Identity verification failed',
        confidence: verificationResult.confidence
      };
    }
  } catch (error) {
    console.error('Attendance system example failed:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Example 6: Error Handling and Validation
 * Proper error handling for production use
 */
export const robustFaceComparisonExample = async (referenceImageUri, newImageUri) => {
  try {
    // Validate inputs
    if (!referenceImageUri || !newImageUri) {
      throw new Error('Both reference and new image URIs are required');
    }
    
    // Check if images exist (you might want to implement this check)
    // const referenceExists = await FileSystem.getInfoAsync(referenceImageUri);
    // const newExists = await FileSystem.getInfoAsync(newImageUri);
    
    console.log('Starting face comparison...');
    const result = await compareFacesDetailed(referenceImageUri, newImageUri);
    
    // Log detailed results for debugging
    console.log('Face comparison completed:', {
      isMatch: result.isMatch,
      confidence: result.confidence,
      timestamp: result.timestamp
    });
    
    return {
      success: true,
      data: result
    };
    
  } catch (error) {
    // Handle different types of errors
    if (error.message.includes('No face detected')) {
      return {
        success: false,
        error: 'FACE_NOT_DETECTED',
        message: 'No face was detected in one or both images'
      };
    } else if (error.message.includes('Invalid Azure API key')) {
      return {
        success: false,
        error: 'API_KEY_INVALID',
        message: 'Azure Face API configuration is invalid'
      };
    } else if (error.message.includes('Rate limit exceeded')) {
      return {
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later'
      };
    } else {
      return {
        success: false,
        error: 'UNKNOWN_ERROR',
        message: error.message
      };
    }
  }
};

// Export all examples
export default {
  basicFaceComparisonExample,
  detailedFaceComparisonExample,
  userRegistrationAndVerificationExample,
  cameraIntegrationExample,
  attendanceSystemExample,
  robustFaceComparisonExample
};