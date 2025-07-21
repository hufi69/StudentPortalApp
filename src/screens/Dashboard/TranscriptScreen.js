import { View, Text, StyleSheet, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import * as Print from "expo-print" // Import Print module
import * as Sharing from "expo-sharing" // Import Sharing module
import { COLORS } from "../../constants/colors"
import CustomButton from "../../components/CustomButton" // Import CustomButton

// Dummy data for academic transcript
const dummyTranscript = [
  {
    semester: "Fall 2023",
    gpa: "3.85",
    courses: [
      { code: "CS101", title: "Programming Fundamentals", grade: "A", credits: 3 },
      { code: "MA101", title: "Linear Algebra", grade: "A-", credits: 3 },
      { code: "EN101", title: "English Composition", grade: "B+", credits: 3 },
      { code: "PH101", title: "Applied Physics", grade: "A", credits: 3 },
    ],
  },
  {
    semester: "Spring 2024",
    gpa: "3.70",
    courses: [
      { code: "CS201", title: "Data Structures", grade: "B+", credits: 3 },
      { code: "MA201", title: "Calculus I", grade: "B", credits: 3 },
      { code: "SS101", title: "Sociology", grade: "A-", credits: 3 },
      { code: "EE101", title: "Basic Electronics", grade: "A", credits: 3 },
    ],
  },
  {
    semester: "Fall 2024",
    gpa: "3.95",
    courses: [
      { code: "CS301", title: "Algorithms", grade: "A", credits: 3 },
      { code: "MA301", title: "Differential Equations", grade: "A", credits: 3 },
      { code: "SE101", title: "Software Engineering", grade: "A-", credits: 3 },
      { code: "IS101", title: "Islamic Studies", grade: "A+", credits: 2 },
    ],
  },
]

const TranscriptScreen = () => {
  // Calculate overall CGPA
  const totalCredits = dummyTranscript.reduce(
    (acc, sem) => acc + sem.courses.reduce((cAcc, course) => cAcc + course.credits, 0),
    0,
  )
  const totalWeightedGpa = dummyTranscript.reduce(
    (acc, sem) => acc + Number.parseFloat(sem.gpa) * sem.courses.reduce((cAcc, course) => cAcc + course.credits, 0),
    0,
  )
  const overallCGPA = totalCredits > 0 ? (totalWeightedGpa / totalCredits).toFixed(2) : "N/A"

  // Function to generate HTML content for the transcript
  const generateTranscriptHtml = () => {
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Academic Transcript</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
          h1 { color: ${COLORS.primary}; text-align: center; margin-bottom: 10px; }
          h2 { color: ${COLORS.textPrimary}; text-align: center; margin-bottom: 20px; font-size: 18px; }
          .summary-card {
            background-color: ${COLORS.surface};
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .summary-title { font-size: 20px; font-weight: bold; color: ${COLORS.textPrimary}; margin-top: 10px; }
          .cgpa-text { font-size: 48px; font-weight: bold; color: ${COLORS.primary}; margin: 10px 0; }
          .summary-subtitle { font-size: 14px; color: ${COLORS.textSecondary}; }

          .semester-card {
            background-color: ${COLORS.surface};
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .semester-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid ${COLORS.grayLight};
          }
          .semester-title { font-size: 18px; font-weight: bold; color: ${COLORS.textPrimary}; }
          .semester-gpa { font-size: 16px; font-weight: 600; color: ${COLORS.primary}; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
          th { background-color: ${COLORS.primaryLight}; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Academic Transcript</h1>
        <h2>Your Complete Academic Record</h2>

        <div class="summary-card">
          <p class="summary-title">Overall CGPA</p>
          <p class="cgpa-text">${overallCGPA}</p>
          <p class="summary-subtitle">Congratulations on your progress!</p>
        </div>
    `

    dummyTranscript.forEach((semesterData) => {
      htmlContent += `
        <div class="semester-card">
          <div class="semester-header">
            <span class="semester-title">${semesterData.semester}</span>
            <span class="semester-gpa">GPA: ${semesterData.gpa}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Title</th>
                <th>Grade</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
      `
      semesterData.courses.forEach((course) => {
        htmlContent += `
          <tr>
            <td>${course.code}</td>
            <td>${course.title}</td>
            <td>${course.grade}</td>
            <td>${course.credits}</td>
          </tr>
        `
      })
      htmlContent += `
            </tbody>
          </table>
        </div>
      `
    })

    htmlContent += `
        <div class="footer">
          <p>Generated by Student Portal App - ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `
    return htmlContent
  }

  // Function to handle the download/print action
  const handleDownloadTranscript = async () => {
    try {
      const html = generateTranscriptHtml()
      const { uri } = await Print.printToFileAsync({ html })

      if (uri) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: "Download Academic Transcript",
            UTI: "com.adobe.pdf",
          })
        } else {
          Alert.alert("Sharing Not Available", "Sharing is not available on your device.")
        }
      }
    } catch (error) {
      console.error("Error downloading transcript:", error)
      Alert.alert("Download Failed", "Could not generate or share the transcript. Please try again.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Academic Transcript</Text>
        <Text style={styles.subtitle}>Your complete academic record.</Text>

        {/* Overall CGPA Summary */}
        <View style={styles.summaryCard}>
          <Ionicons name="trophy-outline" size={30} color={COLORS.primary} />
          <Text style={styles.summaryTitle}>Overall CGPA</Text>
          <Text style={styles.cgpaText}>{overallCGPA}</Text>
          <Text style={styles.summarySubtitle}>Congratulations on your progress!</Text>
        </View>

        {dummyTranscript.length > 0 ? (
          dummyTranscript.map((semesterData, index) => (
            <View key={index} style={styles.semesterCard}>
              <View style={styles.semesterHeader}>
                <Ionicons name="school-outline" size={22} color={COLORS.secondaryDark} />
                <Text style={styles.semesterTitle}>{semesterData.semester}</Text>
                <Text style={styles.semesterGpa}>GPA: {semesterData.gpa}</Text>
              </View>
              <View style={styles.courseList}>
                {semesterData.courses.map((course, courseIndex) => (
                  <View key={courseIndex} style={styles.courseItem}>
                    <Text style={styles.courseItemCode}>{course.code}</Text>
                    <Text style={styles.courseItemTitle}>{course.title}</Text>
                    <Text style={styles.courseItemGrade}>{course.grade}</Text>
                    <Text style={styles.courseItemCredits}>({course.credits} Cr)</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons name="information-circle-outline" size={30} color={COLORS.info} />
            <Text style={styles.emptyStateText}>No transcript data available yet.</Text>
          </View>
        )}

        {/* Download Button */}
        <CustomButton
          title="Download Transcript (PDF)"
          onPress={handleDownloadTranscript}
          variant="primary"
          size="large"
          style={styles.downloadButton}
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
  summaryCard: {
    backgroundColor: COLORS.surface, // Use new surface color
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  cgpaText: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.primary,
    marginVertical: 10,
  },
  summarySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  semesterCard: {
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
  semesterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  semesterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginLeft: 10,
    flex: 1,
  },
  semesterGpa: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  courseList: {
    marginTop: 5,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.grayLight,
  },
  courseItemCode: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    width: 60, // Fixed width for code
  },
  courseItemTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    marginHorizontal: 10,
  },
  courseItemGrade: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    width: 40, // Fixed width for grade
    textAlign: "center",
  },
  courseItemCredits: {
    fontSize: 12,
    color: COLORS.gray,
    width: 50, // Fixed width for credits
    textAlign: "right",
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
  downloadButton: {
    marginTop: 30,
    marginBottom: 20,
  },
})

export default TranscriptScreen
