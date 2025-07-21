// src/api/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage"

const USERS_STORAGE_KEY = "@registered_users"
let registeredUsers = [] // This will now be initialized from AsyncStorage

// Function to load users from AsyncStorage
const loadUsers = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USERS_STORAGE_KEY)
    if (jsonValue != null) {
      registeredUsers = JSON.parse(jsonValue)
      console.log("Users loaded from AsyncStorage:", registeredUsers.length, "users")
    } else {
      registeredUsers = []
      console.log("No users found in AsyncStorage. Initializing empty array.")
    }
  } catch (e) {
    console.error("Failed to load users from AsyncStorage:", e)
    registeredUsers = [] // Fallback to empty array on error
  }
}

// Function to save users to AsyncStorage
const saveUsers = async () => {
  try {
    const jsonValue = JSON.stringify(registeredUsers)
    await AsyncStorage.setItem(USERS_STORAGE_KEY, jsonValue)
    console.log("Users saved to AsyncStorage.")
  } catch (e) {
    console.error("Failed to save users to AsyncStorage:", e)
  }
}

// Initialize users when the module is loaded
loadUsers()

// Helper function to validate roll number format
const validateRollNumber = (rollNumber) => {
  // Roll number should be in format: sp22, fa21, sp20, etc.
  // Valid years for 2025 (4-6 years back) are 2019, 2020, 2021, 2022, 2023, 2024, 2025
  const rollPattern = /^(sp|fa)(19|20|21|22|23|24|25)$/i
  return rollPattern.test(rollNumber)
}

// Helper function to validate email format
const validateUniversityEmail = (email) => {
  // Email should end with @university.edu.pk
  return email.endsWith("@university.edu.pk")
}

// Helper function to "hash" password (simple simulation - NOT CRYPTOGRAPHICALLY SECURE)
const hashPassword = (password) => {
  // This is a very basic, non-cryptographic "hash" for simulation purposes.
  // It simply reverses the string and adds a salt.
  // In a real app, use a proper hashing library like bcrypt on a backend.
  const saltedPassword = password + "secure_salt_key_2025_v2"
  return saltedPassword.split("").reverse().join("")
}

// Helper function to verify password
const verifyPassword = (inputPassword, hashedPassword) => {
  return hashPassword(inputPassword) === hashedPassword
}

export const registerUser = async (name, rollNumber, email, password) => {
  await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API call delay

  // Validate roll number format
  if (!validateRollNumber(rollNumber)) {
    throw new Error("Invalid roll number format. Use format like 'sp22', 'fa21', 'sp20', etc.")
  }

  // Validate email format
  if (!validateUniversityEmail(email)) {
    throw new Error("Email must be in format: username@university.edu.pk")
  }

  // Check if user already exists with same email
  const existingUserByEmail = registeredUsers.find((user) => user.email === email.toLowerCase())
  if (existingUserByEmail) {
    throw new Error("User with this email already exists.")
  }

  // Check if user already exists with same roll number
  const existingUserByRoll = registeredUsers.find((user) => user.rollNumber.toLowerCase() === rollNumber.toLowerCase())
  if (existingUserByRoll) {
    throw new Error("User with this roll number already exists.")
  }

  // Hash the password before storing
  const hashedPassword = hashPassword(password)

  const newUser = {
    name,
    rollNumber: rollNumber.toLowerCase(),
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  }

  registeredUsers.push(newUser)
  await saveUsers() // Save to AsyncStorage after registration
  console.log("User registered:", { ...newUser, password: "[HIDDEN]" })
  console.log("Total registered users:", registeredUsers.length)

  return { success: true, user: { ...newUser, password: undefined } } // Don't return password
}

export const loginUser = async (email, password) => {
  await new Promise((resolve) => setTimeout(resolve, 600)) // Simulate API call delay

  // Validate email format
  if (!validateUniversityEmail(email)) {
    throw new Error("Please use your university email (@university.edu.pk)")
  }

  // Find user by email
  const user = registeredUsers.find((u) => u.email === email.toLowerCase())

  if (!user) {
    throw new Error("No account found with this email. Please sign up first.")
  }

  // Verify password
  if (!verifyPassword(password, user.password)) {
    throw new Error("Incorrect password. Please try again.")
  }

  console.log("User logged in:", { ...user, password: "[HIDDEN]" })
  return {
    success: true,
    user: {
      ...user,
      password: undefined, // Don't return password
    },
  }
}

// Helper function to get valid roll number years (for UI hints)
export const getValidRollYears = () => {
  const currentYear = new Date().getFullYear()
  const validYears = []

  // Generate valid years (from 2019 to current year)
  for (let year = 2019; year <= currentYear; year++) {
    validYears.push(year.toString().slice(-2)) // Get last 2 digits
  }

  return validYears.sort() // e.g., ['19', '20', '21', '22', '23', '24', '25']
}

// For debugging: You can pre-register a test user (uncomment to use)
;(async () => {
  await loadUsers() // Ensure users are loaded before attempting to register
  const testEmail = "test@university.edu.pk"
  const testRollNumber = "sp22"
  const existingTestUser = registeredUsers.find((u) => u.email === testEmail || u.rollNumber === testRollNumber)

  if (!existingTestUser) {
    try {
      await registerUser("Test User", testRollNumber, testEmail, "Password123")
      console.log("Pre-registered test user.")
    } catch (e) {
      // Log the error but don't treat it as critical if it's just a duplicate
      console.warn("Failed to pre-register test user (might already exist):", e.message)
    }
  }
})()
