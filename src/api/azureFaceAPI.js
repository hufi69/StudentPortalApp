// src/api/azureFaceAPI.js
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentConfig, validateConfig } from '../config/azureConfig';

// Get Azure Face API Configuration
const AZURE_CONFIG = getCurrentConfig();

// Storage keys for local caching
const STORAGE_KEYS = {
  PERSON_GROUP_TRAINED: '@azure_person_group_trained',
  USER_FACE_DATA: '@user_face_data_',
};

class AzureFaceAPI {
  constructor() {
    this.baseURL = `${AZURE_CONFIG.ENDPOINT}/face/${AZURE_CONFIG.API_VERSION}`;
    this.headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': AZURE_CONFIG.SUBSCRIPTION_KEY,
    };
  }

  // Helper method to convert image URI to base64
  async imageToBase64(imageUri) {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to process image');
    }
  }

  // Helper method to make API requests with proper error handling
  async makeAPIRequest(url, method = 'GET', data = null, customHeaders = {}) {
    try {
      const config = {
        method,
        url,
        headers: { ...this.headers, ...customHeaders },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Azure Face API Error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Azure API key. Please check your subscription key.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Please check your Azure Face API permissions.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Azure Face API error');
      }
      
      throw new Error('Failed to connect to Azure Face API');
    }
  }

  // 1. Detect faces in an image
  async detectFaces(imageUri) {
    try {
      const base64Image = await this.imageToBase64(imageUri);
      
      const response = await this.makeAPIRequest(
        `${this.baseURL}/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,emotion`,
        'POST',
        {
          data: base64Image
        },
        {
          'Content-Type': 'application/octet-stream'
        }
      );

      return response;
    } catch (error) {
      console.error('Face detection error:', error);
      throw error;
    }
  }

  // 2. Create Person Group (one-time setup)
  async createPersonGroup() {
    try {
      await this.makeAPIRequest(
        `${this.baseURL}/persongroups/${AZURE_CONFIG.PERSON_GROUP_ID}`,
        'PUT',
        {
          name: 'Student Portal Users',
          userData: 'Person group for student portal face recognition'
        }
      );
      
      console.log('Person group created successfully');
      return true;
    } catch (error) {
      if (error.message.includes('PersonGroupExists')) {
        console.log('Person group already exists');
        return true;
      }
      throw error;
    }
  }

  // 3. Create a person in the person group
  async createPerson(userId, userName) {
    try {
      const response = await this.makeAPIRequest(
        `${this.baseURL}/persongroups/${AZURE_CONFIG.PERSON_GROUP_ID}/persons`,
        'POST',
        {
          name: userName,
          userData: `Student ID: ${userId}`
        }
      );

      // Store person ID locally
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.USER_FACE_DATA}${userId}`,
        JSON.stringify({
          personId: response.personId,
          userName,
          userId,
          createdAt: new Date().toISOString()
        })
      );

      return response.personId;
    } catch (error) {
      console.error('Create person error:', error);
      throw error;
    }
  }

  // 4. Add face to person (for registration)
  async addFaceToPerson(userId, imageUri) {
    try {
      // Get stored person data
      const personDataStr = await AsyncStorage.getItem(`${STORAGE_KEYS.USER_FACE_DATA}${userId}`);
      if (!personDataStr) {
        throw new Error('Person not found. Please register first.');
      }

      const personData = JSON.parse(personDataStr);
      const base64Image = await this.imageToBase64(imageUri);

      const response = await this.makeAPIRequest(
        `${this.baseURL}/persongroups/${AZURE_CONFIG.PERSON_GROUP_ID}/persons/${personData.personId}/persistedFaces`,
        'POST',
        {
          data: base64Image
        },
        {
          'Content-Type': 'application/octet-stream'
        }
      );

      // Update stored person data with face ID
      const updatedPersonData = {
        ...personData,
        faceIds: [...(personData.faceIds || []), response.persistedFaceId],
        lastUpdated: new Date().toISOString()
      };

      await AsyncStorage.setItem(
        `${STORAGE_KEYS.USER_FACE_DATA}${userId}`,
        JSON.stringify(updatedPersonData)
      );

      return response.persistedFaceId;
    } catch (error) {
      console.error('Add face to person error:', error);
      throw error;
    }
  }

  // 5. Train the person group (required after adding faces)
  async trainPersonGroup() {
    try {
      await this.makeAPIRequest(
        `${this.baseURL}/persongroups/${AZURE_CONFIG.PERSON_GROUP_ID}/train`,
        'POST'
      );

      // Wait for training to complete
      let trainingStatus = 'running';
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (trainingStatus === 'running' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const status = await this.makeAPIRequest(
          `${this.baseURL}/persongroups/${AZURE_CONFIG.PERSON_GROUP_ID}/training`
        );
        
        trainingStatus = status.status;
        attempts++;
      }

      if (trainingStatus === 'succeeded') {
        await AsyncStorage.setItem(STORAGE_KEYS.PERSON_GROUP_TRAINED, 'true');
        console.log('Person group training completed successfully');
        return true;
      } else {
        throw new Error(`Training failed with status: ${trainingStatus}`);
      }
    } catch (error) {
      console.error('Train person group error:', error);
      throw error;
    }
  }

  // 6. Identify faces (main verification function)
  async identifyFace(imageUri) {
    try {
      // First detect faces in the image
      const detectedFaces = await this.detectFaces(imageUri);
      
      if (!detectedFaces || detectedFaces.length === 0) {
        throw new Error('No faces detected in the image');
      }

      if (detectedFaces.length > 1) {
        throw new Error('Multiple faces detected. Please ensure only one face is visible.');
      }

      const faceId = detectedFaces[0].faceId;

      // Identify the face
      const response = await this.makeAPIRequest(
        `${this.baseURL}/identify`,
        'POST',
        {
          personGroupId: AZURE_CONFIG.PERSON_GROUP_ID,
          faceIds: [faceId],
          maxNumOfCandidatesReturned: 1,
          confidenceThreshold: 0.5
        }
      );

      return {
        faceId,
        detectedFace: detectedFaces[0],
        identificationResult: response[0] || null
      };
    } catch (error) {
      console.error('Face identification error:', error);
      throw error;
    }
  }

  // 7. Compare two faces directly (alternative to person group method)
  async compareFaces(referenceImageUri, newImageUri) {
    try {
      // Detect faces in both images
      const [referenceFaces, newFaces] = await Promise.all([
        this.detectFaces(referenceImageUri),
        this.detectFaces(newImageUri)
      ]);

      if (!referenceFaces || referenceFaces.length === 0) {
        throw new Error('No face detected in reference image');
      }

      if (!newFaces || newFaces.length === 0) {
        throw new Error('No face detected in new image');
      }

      if (referenceFaces.length > 1 || newFaces.length > 1) {
        throw new Error('Multiple faces detected. Please ensure only one face is visible in each image.');
      }

      // Verify faces
      const response = await this.makeAPIRequest(
        `${this.baseURL}/verify`,
        'POST',
        {
          faceId1: referenceFaces[0].faceId,
          faceId2: newFaces[0].faceId
        }
      );

      return {
        isIdentical: response.isIdentical,
        confidence: response.confidence,
        threshold: 0.5, // Recommended threshold
        referenceFace: referenceFaces[0],
        newFace: newFaces[0]
      };
    } catch (error) {
      console.error('Face comparison error:', error);
      throw error;
    }
  }

  // 8. Register user with face (complete registration flow)
  async registerUserWithFace(userId, userName, imageUri) {
    try {
      console.log('Starting user registration with face...');
      
      // Step 1: Ensure person group exists
      await this.createPersonGroup();
      
      // Step 2: Create person
      const personId = await this.createPerson(userId, userName);
      console.log('Person created with ID:', personId);
      
      // Step 3: Add face to person
      const faceId = await this.addFaceToPerson(userId, imageUri);
      console.log('Face added with ID:', faceId);
      
      // Step 4: Train person group
      await this.trainPersonGroup();
      console.log('Person group training completed');
      
      return {
        success: true,
        personId,
        faceId,
        message: 'User registered successfully with face recognition'
      };
    } catch (error) {
      console.error('User registration error:', error);
      throw error;
    }
  }

  // 9. Verify user identity
  async verifyUserIdentity(userId, imageUri) {
    try {
      // Check if person group is trained
      const isTrained = await AsyncStorage.getItem(STORAGE_KEYS.PERSON_GROUP_TRAINED);
      if (!isTrained) {
        throw new Error('Face recognition system not ready. Please contact administrator.');
      }

      // Get user's person data
      const personDataStr = await AsyncStorage.getItem(`${STORAGE_KEYS.USER_FACE_DATA}${userId}`);
      if (!personDataStr) {
        throw new Error('User not registered for face recognition');
      }

      const personData = JSON.parse(personDataStr);

      // Identify face in the image
      const identificationResult = await this.identifyFace(imageUri);

      if (!identificationResult.identificationResult || 
          !identificationResult.identificationResult.candidates || 
          identificationResult.identificationResult.candidates.length === 0) {
        return {
          success: false,
          confidence: 0,
          message: 'Face not recognized'
        };
      }

      const candidate = identificationResult.identificationResult.candidates[0];
      
      // Check if identified person matches the expected user
      if (candidate.personId === personData.personId && candidate.confidence >= 0.5) {
        return {
          success: true,
          confidence: candidate.confidence,
          personId: candidate.personId,
          message: 'Identity verified successfully'
        };
      } else {
        return {
          success: false,
          confidence: candidate.confidence,
          message: 'Identity verification failed'
        };
      }
    } catch (error) {
      console.error('Identity verification error:', error);
      throw error;
    }
  }

  // 10. Get user face data from local storage
  async getUserFaceData(userId) {
    try {
      const personDataStr = await AsyncStorage.getItem(`${STORAGE_KEYS.USER_FACE_DATA}${userId}`);
      return personDataStr ? JSON.parse(personDataStr) : null;
    } catch (error) {
      console.error('Get user face data error:', error);
      return null;
    }
  }

  // 11. Check if user is registered for face recognition
  async isUserRegistered(userId) {
    const userData = await this.getUserFaceData(userId);
    return userData !== null && userData.faceIds && userData.faceIds.length > 0;
  }

  // 12. Delete user face data (for privacy/GDPR compliance)
  async deleteUserFaceData(userId) {
    try {
      const personData = await this.getUserFaceData(userId);
      if (!personData) {
        return { success: true, message: 'User not found' };
      }

      // Delete person from Azure
      await this.makeAPIRequest(
        `${this.baseURL}/persongroups/${AZURE_CONFIG.PERSON_GROUP_ID}/persons/${personData.personId}`,
        'DELETE'
      );

      // Remove from local storage
      await AsyncStorage.removeItem(`${STORAGE_KEYS.USER_FACE_DATA}${userId}`);

      // Retrain person group
      await this.trainPersonGroup();

      return {
        success: true,
        message: 'User face data deleted successfully'
      };
    } catch (error) {
      console.error('Delete user face data error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new AzureFaceAPI();

// Export configuration for setup
export { AZURE_CONFIG };