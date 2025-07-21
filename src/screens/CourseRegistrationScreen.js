"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"
import CustomButton from "../components/CustomButton"

// Dummy data for current and next semester courses
const dummyCurrentCourses = [
  { id: "c1", code: "CS301", title: "Algorithms", credits: 3, semester: "Fall 2024" },
  { id: "c2", code: "MA301", title: "Differential Equations", credits: 3, semester: "Fall 2024" },
  { id: "c3", code: "SE101", title: "Software Engineering", credits: 3, semester: "Fall 2024" },
  { id: "c4", code: "IS101", title: "Islamic Studies", credits: 2, semester: "Fall 2024" },
]

const dummyNextSemesterCourses = [
  { id: "n1", code: "CS401", title: "Operating Systems", credits: 3, description: "Core course on OS concepts." },
  { id: "n2", code: "AI301", title: "Introduction to AI", credits: 3, description: "Fundamentals of AI and ML." },
  { id: "n3", code: "DB301", title: "Database Systems", credits: 3, description: "Relational databases and SQL." },
  {
    id: "n4",
    code: "NW401",
    title: "Computer Networks",
    credits: 3,
    description: "Network protocols and architecture.",
  },
  {
    id: "n5",
    code: "EL201",
    title: "Elective I: Web Development",
    credits: 3,
    description: "Building modern web applications.",
  },
  {
    id: "n6",
    code: "EL202",
    title: "Elective II: Mobile App Dev",
    credits: 3,
    description: "Developing apps for iOS/Android.",
  },
]

const CourseRegistrationScreen = () => {
  const [selectedNextCourses, setSelectedNextCourses] = useState([])

  const handleAddCourse = (course) => {
    if (!selectedNextCourses.some((c) => c.id === course.id)) {
      setSelectedNextCourses((prev) => [...prev, course])
      Alert.alert("Added", `${course.title} added for next semester.`)
    } else {
      Alert.alert("Already Added", `${course.title} is already in your selection.`)
    }
  }

  const handleDropCourse = (courseId) => {
    setSelectedNextCourses((prev) => prev.filter((c) => c.id !== courseId))
    Alert.alert("Dropped", "Course removed from selection.")
  }

  const handleSaveRegistration = () => {
    // In a real application, this would send data to a backend API
    console.log("Saving selected courses:", selectedNextCourses)
    Alert.alert("Registration Saved", "Your course selections have been saved successfully!")
    // Optionally, clear selected courses or navigate away
    setSelectedNextCourses([])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Course Registration</Text>
        <Text style={styles.subtitle}>Manage your current and upcoming semester courses.</Text>

        {/* Current Semester Courses */}
        <Text style={styles.sectionTitle}>Current Semester Courses</Text>
        {dummyCurrentCourses.length > 0 ? (
          dummyCurrentCourses.map((course) => (
            <View key={course.id} style={styles.courseCard}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} style={styles.courseIcon} />
              <View style={styles.courseInfo}>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseCredits}>{course.credits} Credits</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons name="information-circle-outline" size={30} color={COLORS.info} />
            <Text style={styles.emptyStateText}>No courses registered for the current semester.</Text>
          </View>
        )}

        {/* Next Semester Course Selection */}
        <Text style={styles.sectionTitle}>Next Semester Course Selection</Text>
        <Text style={styles.sectionDescription}>Select courses you wish to add or drop for the upcoming semester.</Text>

        {/* Available Courses */}
        <View style={styles.subsection}>
          <Text style={styles.subsectionTitle}>Available Courses</Text>
          {dummyNextSemesterCourses.map((course) => (
            <View key={course.id} style={styles.availableCourseCard}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseCredits}>{course.credits} Credits</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>
              </View>
              <CustomButton
                title="Add"
                onPress={() => handleAddCourse(course)}
                variant="primary"
                size="small"
                style={styles.addDropButton}
                disabled={selectedNextCourses.some((c) => c.id === course.id)}
              />
            </View>
          ))}
        </View>

        {/* Selected Courses for Next Semester */}
        <View style={styles.subsection}>
          <Text style={styles.subsectionTitle}>Your Selection for Next Semester</Text>
          {selectedNextCourses.length > 0 ? (
            selectedNextCourses.map((course) => (
              <View key={course.id} style={styles.selectedCourseCard}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseCode}>{course.code}</Text>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseCredits}>{course.credits} Credits</Text>
                </View>
                <CustomButton
                  title="Drop"
                  onPress={() => handleDropCourse(course.id)}
                  variant="outline"
                  size="small"
                  style={styles.addDropButton}
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyStateCard}>
              <Ionicons name="information-circle-outline" size={30} color={COLORS.info} />
              <Text style={styles.emptyStateText}>No courses selected for next semester yet.</Text>
            </View>
          )}
        </View>

        <CustomButton
          title="Save Registration"
          onPress={handleSaveRegistration}
          variant="primary"
          size="large"
          style={styles.saveButton}
          disabled={selectedNextCourses.length === 0}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 80, // Add extra padding for bottom tab bar
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
    marginTop: 20,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 15,
    textAlign: "center",
  },
  subsection: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    paddingBottom: 10,
  },
  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 2,
  },
  availableCourseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background, // Lighter background for available courses
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  selectedCourseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight + "10", // Light primary background for selected
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  courseIcon: {
    marginRight: 15,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  courseTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  courseCredits: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  courseDescription: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
  },
  addDropButton: {
    marginLeft: 15,
    minWidth: 80, // Ensure button has minimum width
  },
  emptyStateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
    textAlign: "center",
  },
  saveButton: {
    marginTop: 30,
    marginBottom: 20,
  },
})

export default CourseRegistrationScreen
