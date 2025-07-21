export const ROUTES = {
  // Auth Stack
  LOGIN: "Login",
  SIGNUP: "Signup",
  FORGOT_PASSWORD: "ForgotPassword",

  // Main App Navigators
  MAIN_DRAWER: "MainDrawer", // For the Drawer Navigator
  MAIN_TABS: "MainTabs", // For the Bottom Tab Navigator

  // Main Tab Screens
  DASHBOARD_TAB: "DashboardTab",
  ATTENDANCE_TAB: "AttendanceTab",
  QUIZZES_TAB: "QuizzesTab",
  UPLOAD_MARKS_TAB: "UploadMarksTab", // This tab will now point to StudentMarksScreen
  DATESHEET_TAB: "DatesheetTab",

  // Screens accessible directly or via tabs/drawer
  HOME: "Home", // Actual HomeScreen component
  PROFILE: "Profile",
  COURSES: "Courses",
  MARKS: "Marks", // General Marks Overview (can link to StudentMarks or Transcript)
  TRANSCRIPT: "Transcript", // NEW: For the full academic transcript
  COURSE_REGISTRATION: "CourseRegistration", // NEW: For course registration screen
  EXAM_SCANNER: "ExamScanner", // NEW: For QR/Barcode exam entry scanner
  FEE_TRANSCRIPT: "FeeTranscript", // NEW: For fee transcript screen
  TEST_QR_GENERATOR: "TestQrGenerator", // NEW: For generating test QR codes
  FACE_ATTENDANCE: "FaceAttendance", // NEW: For face detection attendance
  BIOMETRIC_ATTENDANCE: "BiometricAttendance", // NEW: For biometric attendance
  // Drawer Specific Routes (if needed for direct navigation)
  SETTINGS: "Settings",
  SUPPORT: "Support",
  CALENDAR: "Calendar",
  NOTIFICATIONS: "Notifications",
  HOLIDAYS: "Holidays",
}
