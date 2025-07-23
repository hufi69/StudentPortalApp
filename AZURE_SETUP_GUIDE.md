# Azure Face API Setup Guide for Student Portal

This guide will help you set up Azure Face API integration for your Student Portal app's face recognition features.

## Prerequisites

- Azure account (free tier available)
- Access to Azure Portal
- Student Portal app with the Azure Face API integration files

## Step 1: Create Azure Face API Resource

### 1.1 Sign in to Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your Azure account

### 1.2 Create Face API Resource
1. Click **"Create a resource"** in the Azure Portal
2. Search for **"Face"** and select **"Face"** from Microsoft
3. Click **"Create"**
4. Fill in the required information:
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or select existing
   - **Region**: Choose a region close to your users (e.g., East US, West Europe)
   - **Name**: Give your resource a unique name (e.g., `student-portal-face-api`)
   - **Pricing Tier**: 
     - **Free F0**: 20 transactions per minute, 30,000 transactions per month (good for testing)
     - **Standard S0**: 10 transactions per second, pay-per-use (for production)

5. Click **"Review + Create"** then **"Create"**

### 1.3 Get API Keys and Endpoint
1. Once deployed, go to your Face API resource
2. In the left menu, click **"Keys and Endpoint"**
3. Copy the following information:
   - **Key 1** (your subscription key)
   - **Endpoint** (your API endpoint URL)

## Step 2: Configure Your App

### 2.1 Update Azure Configuration
1. Open `src/config/azureConfig.js` in your project
2. Replace the placeholder values:

```javascript
export const AZURE_FACE_CONFIG = {
  // Replace YOUR_REGION with your actual region (e.g., eastus, westeurope)
  ENDPOINT: 'https://YOUR_REGION.api.cognitive.microsoft.com',
  
  // Replace with your actual subscription key from Azure Portal
  SUBSCRIPTION_KEY: 'YOUR_ACTUAL_SUBSCRIPTION_KEY_HERE',
  
  // Keep these as default unless you need to change them
  API_VERSION: 'v1.0',
  PERSON_GROUP_ID: 'student-portal-group',
  CONFIDENCE_THRESHOLD: 0.5,
  MAX_CANDIDATES: 1,
  TRAINING_TIMEOUT: 30,
};
```

### 2.2 Example Configuration
```javascript
export const AZURE_FACE_CONFIG = {
  ENDPOINT: 'https://eastus.api.cognitive.microsoft.com',
  SUBSCRIPTION_KEY: '1234567890abcdef1234567890abcdef',
  API_VERSION: 'v1.0',
  PERSON_GROUP_ID: 'student-portal-group',
  CONFIDENCE_THRESHOLD: 0.5,
  MAX_CANDIDATES: 1,
  TRAINING_TIMEOUT: 30,
};
```

## Step 3: Test the Integration

### 3.1 Run Your App
```bash
npm start
# or
expo start
```

### 3.2 Navigate to Face Attendance
1. Open your app
2. Navigate to the Azure Face Attendance screen
3. Check if the configuration status shows "Azure Configuration Ready"

### 3.3 Register Your Face
1. Tap **"Register Face"**
2. Allow camera permissions if prompted
3. Position your face in the frame and capture
4. Wait for the registration process to complete

### 3.4 Test Face Recognition
1. Tap **"Mark Attendance"**
2. Position your face in the frame and capture
3. Check if your identity is verified successfully

## Step 4: Understanding the Features

### 4.1 Face Registration
- Creates a Person Group in Azure Face API
- Registers individual users with their face data
- Trains the Person Group for recognition

### 4.2 Face Verification
- Captures user's face via camera
- Compares against registered face data
- Returns confidence score and verification result

### 4.3 Person Group Management
- Automatically creates and manages Person Groups
- Handles training and retraining of face models
- Stores local references to Azure Person IDs

## Step 5: Security and Privacy

### 5.1 Data Storage
- Face templates are stored in Azure (not raw images)
- Local storage only contains Person IDs and metadata
- No biometric data is stored locally

### 5.2 Privacy Compliance
- Users can delete their face data
- GDPR compliant data handling
- Secure API communication over HTTPS

### 5.3 Security Best Practices
- Keep your subscription keys secure
- Use environment variables in production
- Implement proper error handling
- Monitor API usage and costs

## Step 6: Production Deployment

### 6.1 Environment Configuration
1. Create separate Azure resources for dev/staging/production
2. Use different Person Group IDs for each environment
3. Configure appropriate confidence thresholds

### 6.2 Monitoring and Logging
1. Set up Azure Monitor for your Face API resource
2. Implement proper logging in your app
3. Monitor API usage and performance

### 6.3 Cost Management
1. Monitor your API usage in Azure Portal
2. Set up billing alerts
3. Consider caching strategies for frequently accessed data

## Troubleshooting

### Common Issues

#### 1. "Invalid Azure API key" Error
- **Solution**: Double-check your subscription key in `azureConfig.js`
- Ensure you copied the correct key from Azure Portal

#### 2. "Failed to connect to Azure Face API" Error
- **Solution**: Verify your endpoint URL is correct
- Check your internet connection
- Ensure the Azure resource is active

#### 3. "No faces detected" Error
- **Solution**: Ensure good lighting conditions
- Position face clearly in the camera frame
- Remove glasses or face coverings if necessary

#### 4. "Person group not found" Error
- **Solution**: The app will automatically create the person group
- Check if your subscription key has proper permissions

#### 5. Low Confidence Scores
- **Solution**: Improve image quality
- Ensure consistent lighting
- Use multiple face samples during registration

### API Limits

#### Free Tier (F0)
- 20 transactions per minute
- 30,000 transactions per month
- Good for development and testing

#### Standard Tier (S0)
- 10 transactions per second
- Pay per transaction
- Suitable for production use

## Advanced Configuration

### Custom Confidence Thresholds
```javascript
// Lower threshold = more lenient matching
CONFIDENCE_THRESHOLD: 0.4, // For testing

// Higher threshold = stricter matching
CONFIDENCE_THRESHOLD: 0.7, // For high-security applications
```

### Multiple Person Groups
```javascript
// Different groups for different purposes
PERSON_GROUP_ID: 'student-attendance-group',
PERSON_GROUP_ID: 'faculty-access-group',
PERSON_GROUP_ID: 'visitor-registration-group',
```

## Support and Resources

- [Azure Face API Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/face/)
- [Azure Face API REST API Reference](https://docs.microsoft.com/en-us/rest/api/faceapi/)
- [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)
- [Azure Support](https://azure.microsoft.com/en-us/support/)

## Next Steps

1. Set up your Azure Face API resource
2. Configure your app with the credentials
3. Test face registration and verification
4. Deploy to your preferred environment
5. Monitor usage and optimize as needed

For any issues or questions, refer to the troubleshooting section or consult the Azure documentation.