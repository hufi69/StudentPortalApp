import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../../constants/colors"
import { ROUTES } from "../../constants/routes" // Import ROUTES for navigation

// Dummy data for current semester marks
const dummySemesterMarks = [
  {
    id: "s1",
    courseCode: "CS101",
    courseTitle: "Programming Fundamentals",
    instructor: "Dr. Ali Khan",
    totalMarks: 100,
    obtainedMarks: 88,
    grade: "A-",
    assessments: [
      { type: "Quiz", name: "Quiz 1", score: "8/10", weight: "10%" },
      { type: "Quiz", name: "Quiz 2", score: "9/10", weight: "10%" },
      { type: "Assignment", name: "Assignment 1", score: "18/20", weight: "20%" },
      { type: "Midterm", name: "Midterm Exam", score: "75/100", weight: "30%" },
      { type: "Final", name: "Final Exam", score: "88/100", weight: "30%" },
    ],
  },
  {
    id: "s2",
    courseCode: "MA201",
    courseTitle: "Calculus I",
    instructor: "Prof. Sara Ahmed",
    totalMarks: 100,
    obtainedMarks: 72,
    grade: "B",
    assessments: [
      { type: "Quiz", name: "Quiz 1", score: "6/10", weight: "10%" },
      { type: "Assignment", name: "Assignment 1", score: "15/20", weight: "20%" },
      { type: "Midterm", name: "Midterm Exam", score: "60/100", weight: "30%" },
      { type: "Final", name: "Final Exam", score: "78/100", weight: "30%" },
    ],
  },
  {
    id: "s3",
    courseCode: "PH101",
    courseTitle: "Applied Physics",
    instructor: "Dr. Usman Tariq",
    totalMarks: 100,
    obtainedMarks: 92,
    grade: "A",
    assessments: [
      { type: "Quiz", name: "Quiz 1", score: "10/10", weight: "10%" },
      { type: "Assignment", name: "Assignment 1", score: "19/20", weight: "20%" },
      { type: "Midterm", name: "Midterm Exam", score: "88/100", weight: "30%" },
      { type: "Final", name: "Final Exam", score: "95/100", weight: "30%" },
    ],
  },
  {
    id: "s4",
    courseCode: "CH101",
    courseTitle: "General Chemistry",
    instructor: "Dr. Sana Khan",
    totalMarks: 100,
    obtainedMarks: 65, // Example for 50-69
    grade: "C+", // Example for 50-69
    assessments: [
      { type: "Quiz", name: "Quiz 1", score: "7/10", weight: "10%" },
      { type: "Assignment", name: "Assignment 1", score: "13/20", weight: "20%" },
      { type: "Midterm", name: "Midterm Exam", score: "55/100", weight: "30%" },
      { type: "Final", name: "Final Exam", score: "68/100", weight: "30%" },
    ],
  },
]

// Helper function to determine color based on marks percentage
const getMarkColor = (obtained, total) => {
  if (total === 0) return COLORS.textPrimary // Avoid division by zero
  const percentage = (obtained / total) * 100

  if (percentage < 50) {
    return COLORS.error // Red for failing
  } else if (percentage < 70) {
    return COLORS.warning // Yellow/Orange for average
  } else if (percentage < 90) {
    return COLORS.info // Cyan/Teal for good
  } else {
    return COLORS.success // Green for excellent
  }
}

const StudentMarksScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Current Semester Marks</Text>
        <Text style={styles.subtitle}>Detailed breakdown of your academic performance.</Text>

        {dummySemesterMarks.length > 0 ? (
          dummySemesterMarks.map((course) => (
            <View key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <Ionicons name="book-outline" size={24} color={COLORS.primary} />
                <View style={styles.courseTitleContainer}>
                  <Text style={styles.courseCode}>{course.courseCode}</Text>
                  <Text style={styles.courseTitle}>{course.courseTitle}</Text>
                </View>
                <View style={styles.gradeContainer}>
                  <Text style={[styles.gradeText, { color: getMarkColor(course.obtainedMarks, course.totalMarks) }]}>
                    {course.grade}
                  </Text>
                  <Text style={styles.obtainedMarksText}>
                    {course.obtainedMarks}/{course.totalMarks}
                  </Text>
                </View>
              </View>
              <Text style={styles.instructorText}>Instructor: {course.instructor}</Text>

              <View style={styles.assessmentsContainer}>
                <Text style={styles.assessmentsHeader}>Assessments:</Text>
                {course.assessments.map((assessment, index) => {
                  // Parse score for color calculation (e.g., "8/10" -> 8, 10)
                  const [obtained, total] = assessment.score.split("/").map(Number)
                  return (
                    <View key={index} style={styles.assessmentItem}>
                      <Text style={styles.assessmentName}>
                        <Text style={styles.assessmentType}>{assessment.type}:</Text> {assessment.name}
                      </Text>
                      <Text style={[styles.assessmentScore, { color: getMarkColor(obtained, total) }]}>
                        {assessment.score}
                      </Text>
                    </View>
                  )
                })}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons name="information-circle-outline" size={30} color={COLORS.info} />
            <Text style={styles.emptyStateText}>No marks available for the current semester.</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.viewTranscriptButton}
          onPress={() => navigation.navigate(ROUTES.TRANSCRIPT)} // Navigate to TranscriptScreen
        >
          <Text style={styles.viewTranscriptButtonText}>View Full Academic Transcript</Text>
          <Ionicons name="arrow-forward-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
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
  courseCard: {
    backgroundColor: COLORS.surface, // Use new surface color
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  courseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  courseTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  courseTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  gradeContainer: {
    alignItems: "flex-end",
  },
  gradeText: {
    fontSize: 24,
    fontWeight: "bold",
    // Color is now dynamic based on getMarkColor
  },
  obtainedMarksText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  instructorText: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 15,
    marginLeft: 5,
  },
  assessmentsContainer: {
    marginTop: 10,
  },
  assessmentsHeader: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  assessmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.grayLight,
    marginLeft: 10,
  },
  assessmentName: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  assessmentType: {
    fontWeight: "bold",
  },
  assessmentScore: {
    fontSize: 14,
    fontWeight: "600",
    // Color is now dynamic based on getMarkColor
  },
  emptyStateCard: {
    backgroundColor: COLORS.surface, // Use new surface color
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
  viewTranscriptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface, // Use new surface color
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  viewTranscriptButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginRight: 10,
  },
})

export default StudentMarksScreen
