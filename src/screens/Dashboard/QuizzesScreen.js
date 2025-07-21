import { View, Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../../constants/colors"
import CustomButton from "../../components/CustomButton"

// Dummy data for demonstration
const dummyQuizzes = {
  upcoming: [
    { id: "q1", title: "CS101 - Chapter 3 Quiz", dueDate: "July 25, 2025", time: "10:00 AM" },
    { id: "q2", title: "MA201 - Midterm Review Quiz", dueDate: "August 1, 2025", time: "02:00 PM" },
  ],
  past: [
    { id: "q3", title: "PH101 - Introduction Quiz", score: "18/20", date: "July 10, 2025" },
    { id: "q4", title: "CS101 - Chapter 1 Quiz", score: "15/20", date: "July 5, 2025" },
    { id: "q5", title: "MA201 - Quiz 1", score: "9/10", date: "June 28, 2025" },
  ],
}

const QuizCard = ({ quiz, type }) => (
  <View style={styles.quizCard}>
    <View style={styles.quizCardHeader}>
      <Ionicons
        name={type === "upcoming" ? "hourglass-outline" : "checkmark-circle-outline"}
        size={24}
        color={type === "upcoming" ? COLORS.warning : COLORS.success}
      />
      <Text style={styles.quizTitle}>{quiz.title}</Text>
    </View>
    {type === "upcoming" ? (
      <View>
        <Text style={styles.quizDetail}>Due Date: {quiz.dueDate}</Text>
        <Text style={styles.quizDetail}>Time: {quiz.time}</Text>
        <CustomButton
          title="Start Quiz"
          onPress={() => console.log("Start Quiz:", quiz.id)}
          variant="primary"
          size="small"
          style={styles.quizButton}
        />
      </View>
    ) : (
      <View>
        <Text style={styles.quizDetail}>Score: {quiz.score}</Text>
        <Text style={styles.quizDetail}>Date: {quiz.date}</Text>
        <CustomButton
          title="View Details"
          onPress={() => console.log("View Quiz Details:", quiz.id)}
          variant="outline"
          size="small"
          style={styles.quizButton}
        />
      </View>
    )}
  </View>
)

const QuizzesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Quizzes</Text>

        {/* Upcoming Quizzes */}
        <Text style={styles.sectionTitle}>Upcoming Quizzes</Text>
        {dummyQuizzes.upcoming.length > 0 ? (
          dummyQuizzes.upcoming.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} type="upcoming" />)
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons name="information-circle-outline" size={30} color={COLORS.info} />
            <Text style={styles.emptyStateText}>No upcoming quizzes at the moment.</Text>
          </View>
        )}

        {/* Past Quizzes */}
        <Text style={styles.sectionTitle}>Past Quizzes</Text>
        {dummyQuizzes.past.length > 0 ? (
          dummyQuizzes.past.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} type="past" />)
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons name="information-circle-outline" size={30} color={COLORS.info} />
            <Text style={styles.emptyStateText}>No past quizzes found.</Text>
          </View>
        )}
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
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
    marginTop: 10,
  },
  quizCard: {
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
  quizCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginLeft: 10,
    flexShrink: 1,
  },
  quizDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
    marginLeft: 34, // Align with title text
  },
  quizButton: {
    marginTop: 15,
    alignSelf: "flex-end",
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
})

export default QuizzesScreen
