import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import CustomButton from '../components/CustomButton';
import azureFaceAPI from '../api/azureFaceAPI';
import { validateConfig } from '../config/azureConfig';

const { width, height } = Dimensions.get('window');

const AzureFaceAttendanceScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isRegistrationMode, setIsRegistrationMode] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [configValid, setConfigValid] = useState(false);
  const [configErrors, setConfigErrors] = useState([]);
  const cameraRef = useRef(null);

  // Mock user data - in real app, get from auth context
  const currentUser = {
    id: 'student123',
    name: 'John Doe',
    email: 'john.doe@university.edu'
  };

  useEffect(() => {
    checkCameraPermissions();
    checkAzureConfig();
    loadAttendanceHistory();
  }, []);

  const checkCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const checkAzureConfig = () => {
    const validation = validateConfig();
    setConfigValid(validation.isValid);
    setConfigErrors(validation.errors);
  };

  const loadAttendanceHistory = async () => {
    // Load attendance history from local storage or API
    // This is a mock implementation
    setAttendanceHistory([
      { date: '2024-01-15', time: '09:30 AM', status: 'Present', confidence: 0.87 },
      { date: '2024-01-14', time: '09:25 AM', status: 'Present', confidence: 0.92 },
      { date: '2024-01-13', time: '09:35 AM', status: 'Present', confidence: 0.85 },
    ]);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        setLoadingMessage('Capturing image...');

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });

        setCameraVisible(false);
        
        if (isRegistrationMode) {
          await registerUserFace(photo.uri);
        } else {
          await verifyUserFace(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      } finally {
        setLoading(false);
        setLoadingMessage('');
      }
    }
  };

  const registerUserFace = async (imageUri) => {
    try {
      setLoadingMessage('Registering your face...');
      
      const result = await azureFaceAPI.registerUserWithFace(
        currentUser.id,
        currentUser.name,
        imageUri
      );

      if (result.success) {
        Alert.alert(
          'Registration Successful!',
          'Your face has been registered successfully. You can now use face recognition for attendance.',
          [{ text: 'OK', onPress: () => setIsRegistrationMode(false) }]
        );
      }
    } catch (error) {
      console.error('Face registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'Failed to register your face. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const verifyUserFace = async (imageUri) => {
    try {
      setLoadingMessage('Verifying your identity...');
      
      const result = await azureFaceAPI.verifyUserIdentity(currentUser.id, imageUri);

      if (result.success) {
        // Mark attendance
        const newAttendance = {
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Present',
          confidence: result.confidence
        };

        setAttendanceHistory(prev => [newAttendance, ...prev]);

        Alert.alert(
          'Attendance Marked!',
          `Welcome ${currentUser.name}!\nConfidence: ${(result.confidence * 100).toFixed(1)}%\nAttendance has been recorded.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Verification Failed',
          `${result.message}\nConfidence: ${(result.confidence * 100).toFixed(1)}%\nPlease try again or contact administrator.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Face verification error:', error);
      Alert.alert(
        'Verification Error',
        error.message || 'Failed to verify your identity. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const checkUserRegistration = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Checking registration status...');
      
      const isRegistered = await azureFaceAPI.isUserRegistered(currentUser.id);
      
      if (isRegistered) {
        Alert.alert(
          'Already Registered',
          'Your face is already registered for attendance. You can start marking attendance.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Not Registered',
          'You need to register your face first before using face attendance.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Register Now', onPress: () => setIsRegistrationMode(true) }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking registration:', error);
      Alert.alert('Error', 'Failed to check registration status.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const startFaceAttendance = () => {
    if (!configValid) {
      Alert.alert(
        'Configuration Error',
        'Azure Face API is not properly configured. Please check the configuration.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (hasPermission === null) {
      Alert.alert('Requesting camera permission...');
      return;
    }

    if (hasPermission === false) {
      Alert.alert(
        'No Camera Access',
        'Please grant camera permission to use face attendance.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsRegistrationMode(false);
    setCameraVisible(true);
  };

  const startFaceRegistration = () => {
    if (!configValid) {
      Alert.alert(
        'Configuration Error',
        'Azure Face API is not properly configured. Please check the configuration.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (hasPermission === false) {
      Alert.alert(
        'No Camera Access',
        'Please grant camera permission to register your face.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsRegistrationMode(true);
    setCameraVisible(true);
  };

  const renderConfigurationStatus = () => (
    <View style={styles.configContainer}>
      <View style={styles.configHeader}>
        <Ionicons 
          name={configValid ? "checkmark-circle" : "warning"} 
          size={24} 
          color={configValid ? COLORS.success : COLORS.warning} 
        />
        <Text style={styles.configTitle}>
          Azure Configuration {configValid ? 'Ready' : 'Required'}
        </Text>
      </View>
      
      {!configValid && (
        <View style={styles.configErrors}>
          {configErrors.map((error, index) => (
            <Text key={index} style={styles.configError}>• {error}</Text>
          ))}
          <Text style={styles.configHelp}>
            Please update src/config/azureConfig.js with your Azure Face API credentials.
          </Text>
        </View>
      )}
    </View>
  );

  const renderAttendanceHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Recent Attendance</Text>
      {attendanceHistory.length === 0 ? (
        <Text style={styles.noHistory}>No attendance records yet</Text>
      ) : (
        attendanceHistory.slice(0, 5).map((record, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyDate}>
              <Text style={styles.historyDateText}>{record.date}</Text>
              <Text style={styles.historyTimeText}>{record.time}</Text>
            </View>
            <View style={styles.historyStatus}>
              <Text style={[styles.historyStatusText, { color: COLORS.success }]}>
                {record.status}
              </Text>
              <Text style={styles.historyConfidence}>
                {(record.confidence * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderCamera = () => (
    <Modal visible={cameraVisible} animationType="slide">
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants.Type.front}
          ratio="16:9"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCameraVisible(false)}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>
                {isRegistrationMode ? 'Register Your Face' : 'Mark Attendance'}
              </Text>
            </View>

            <View style={styles.faceFrame}>
              <View style={styles.faceFrameCorner} />
            </View>

            <View style={styles.cameraInstructions}>
              <Text style={styles.instructionText}>
                {isRegistrationMode 
                  ? 'Position your face in the frame and tap capture'
                  : 'Look at the camera and tap capture to mark attendance'
                }
              </Text>
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <Ionicons name="camera" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{loadingMessage}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={80} color={COLORS.primary} />
          <Text style={styles.title}>Azure Face Attendance</Text>
          <Text style={styles.subtitle}>Secure face recognition powered by Azure</Text>
        </View>

        {renderConfigurationStatus()}

        <View style={styles.actionsContainer}>
          <CustomButton
            title="Mark Attendance"
            onPress={startFaceAttendance}
            style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
            disabled={!configValid}
          />

          <CustomButton
            title="Register Face"
            onPress={startFaceRegistration}
            style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
            disabled={!configValid}
          />

          <CustomButton
            title="Check Registration"
            onPress={checkUserRegistration}
            style={[styles.actionButton, { backgroundColor: COLORS.info }]}
            disabled={!configValid}
          />
        </View>

        {renderAttendanceHistory()}

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Secure Azure Face API integration</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Real-time face verification</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Anti-spoofing protection</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Confidence scoring</Text>
          </View>
        </View>
      </ScrollView>

      {renderCamera()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
  configContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  configHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 10,
  },
  configErrors: {
    marginTop: 10,
  },
  configError: {
    fontSize: 14,
    color: COLORS.error,
    marginBottom: 5,
  },
  configHelp: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 10,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionButton: {
    marginBottom: 15,
  },
  historyContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
  },
  noHistory: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyDate: {
    flex: 1,
  },
  historyDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  historyTimeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  historyStatus: {
    alignItems: 'flex-end',
  },
  historyStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyConfidence: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  featuresContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 10,
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginRight: 50,
  },
  faceFrame: {
    position: 'absolute',
    top: '35%',
    left: '20%',
    width: '60%',
    height: '30%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 150,
  },
  faceFrameCorner: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.primary,
    borderTopLeftRadius: 20,
  },
  cameraInstructions: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
});

export default AzureFaceAttendanceScreen;