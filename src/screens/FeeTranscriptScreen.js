import { View, Text, StyleSheet, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"
import CustomButton from "../components/CustomButton" // Import CustomButton
import * as Print from "expo-print" // Import Print module
import * as Sharing from "expo-sharing" // Import Sharing module

// Import dummy data
import { dummyFeeTranscript } from "../data/dummyData"

const FeeTranscriptScreen = ({ navigation }) => {
  // Calculate overall fee summary
  const totalFeeAllSemesters = dummyFeeTranscript.reduce((acc, sem) => acc + sem.totalFee, 0)
  const totalPaidAllSemesters = dummyFeeTranscript.reduce((acc, sem) => acc + sem.paidAmount, 0)
  const totalDueAllSemesters = totalFeeAllSemesters - totalPaidAllSemesters

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return COLORS.success
      case "Partially Paid":
        return COLORS.warning
      case "Due":
        return COLORS.error
      default:
        return COLORS.gray
    }
  }

  // Function to generate HTML content for the fee transcript
  const generateFeeTranscriptHtml = () => {
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Fee Transcript</title>
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
          .summary-item { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .summary-label { font-weight: bold; color: ${COLORS.textPrimary}; }
          .summary-value { color: ${COLORS.textSecondary}; }
          .total-due { font-size: 20px; font-weight: bold; color: ${COLORS.error}; margin-top: 10px; }
          .total-paid { font-size: 20px; font-weight: bold; color: ${COLORS.success}; margin-top: 10px; }

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
          .semester-status { font-size: 16px; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
          th { background-color: ${COLORS.primaryLight}; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Fee Transcript</h1>
        <h2>Your Financial Record</h2>

        <div class="summary-card">
          <div class="summary-item"><span class="summary-label">Total Fee Across Semesters:</span> <span class="summary-value">PKR ${totalFeeAllSemesters.toLocaleString()}</span></div>
          <div class="summary-item"><span class="summary-label">Total Amount Paid:</span> <span class="summary-value">PKR ${totalPaidAllSemesters.toLocaleString()}</span></div>
          <div class="summary-item"><span class="summary-label">Total Amount Due:</span> <span class="summary-value" style="color: ${getStatusColor(totalDueAllSemesters > 0 ? "Due" : "Paid")};">PKR ${totalDueAllSemesters.toLocaleString()}</span></div>
        </div>
    `

    dummyFeeTranscript.forEach((semesterData) => {
      htmlContent += `
        <div class="semester-card">
          <div class="semester-header">
            <span class="semester-title">${semesterData.semester}</span>
            <span class="semester-status" style="color: ${getStatusColor(semesterData.status)};">Status: ${semesterData.status}</span>
          </div>
          <p>Total Fee: PKR ${semesterData.totalFee.toLocaleString()}</p>
          <p>Paid: PKR ${semesterData.paidAmount.toLocaleString()}</p>
          <p>Due Date: ${semesterData.dueDate}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
      `
      semesterData.details.forEach((detail) => {
        htmlContent += `
          <tr>
            <td>${detail.item}</td>
            <td>PKR ${detail.amount.toLocaleString()}</td>
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
  const handleDownloadFeeTranscript = async () => {
    try {
      const html = generateFeeTranscriptHtml()
      const { uri } = await Print.printToFileAsync({ html })

      if (uri) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: "Download Fee Transcript",
            UTI: "com.adobe.pdf",
          })
        } else {
          Alert.alert("Sharing Not Available", "Sharing is not available on your device.")
        }
      }
    } catch (error) {
      console.error("Error downloading fee transcript:", error)
      Alert.alert("Download Failed", "Could not generate or share the fee transcript. Please try again.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Fee Transcript</Text>
        <Text style={styles.subtitle}>Your complete financial record.</Text>

        {/* Overall Fee Summary */}
        <View style={styles.summaryCard}>
          <Ionicons name="wallet-outline" size={30} color={COLORS.primary} />
          <Text style={styles.summaryTitle}>Overall Financial Summary</Text>
          <View style={styles.summaryDetails}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Fee:</Text>
              <Text style={styles.summaryValue}>PKR {totalFeeAllSemesters.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Paid:</Text>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                PKR {totalPaidAllSemesters.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Due:</Text>
              <Text style={[styles.summaryValue, { color: totalDueAllSemesters > 0 ? COLORS.error : COLORS.success }]}>
                PKR {totalDueAllSemesters.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {dummyFeeTranscript.length > 0 ? (
          dummyFeeTranscript.map((semesterData, index) => (
            <View key={index} style={styles.semesterCard}>
              <View style={styles.semesterHeader}>
                <Ionicons name="cash-outline" size={22} color={COLORS.secondaryDark} />
                <Text style={styles.semesterTitle}>{semesterData.semester}</Text>
                <Text style={[styles.semesterStatus, { color: getStatusColor(semesterData.status) }]}>
                  {semesterData.status}
                </Text>
              </View>
              <View style={styles.feeDetails}>
                <View style={styles.feeDetailItem}>
                  <Text style={styles.feeDetailLabel}>Total Fee:</Text>
                  <Text style={styles.feeDetailValue}>PKR {semesterData.totalFee.toLocaleString()}</Text>
                </View>
                <View style={styles.feeDetailItem}>
                  <Text style={styles.feeDetailLabel}>Paid Amount:</Text>
                  <Text style={styles.feeDetailValue}>PKR {semesterData.paidAmount.toLocaleString()}</Text>
                </View>
                <View style={styles.feeDetailItem}>
                  <Text style={styles.feeDetailLabel}>Due Date:</Text>
                  <Text style={styles.feeDetailValue}>{semesterData.dueDate}</Text>
                </View>
                <Text style={styles.detailsHeader}>Breakdown:</Text>
                {semesterData.details.map((detail, detailIndex) => (
                  <View key={detailIndex} style={styles.detailItem}>
                    <Text style={styles.detailItemName}>{detail.item}</Text>
                    <Text style={styles.detailItemAmount}>PKR {detail.amount.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons name="information-circle-outline" size={30} color={COLORS.info} />
            <Text style={styles.emptyStateText}>No fee transcript data available yet.</Text>
          </View>
        )}

        {/* Download Button */}
        <CustomButton
          title="Download Fee Transcript (PDF)"
          onPress={handleDownloadFeeTranscript}
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
    backgroundColor: COLORS.surface,
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
    marginBottom: 15,
  },
  summaryDetails: {
    width: "100%",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.grayLight,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  summaryValue: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  semesterCard: {
    backgroundColor: COLORS.surface,
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
  semesterStatus: {
    fontSize: 16,
    fontWeight: "600",
  },
  feeDetails: {
    marginTop: 5,
  },
  feeDetailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  feeDetailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  feeDetailValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  detailsHeader: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 15,
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.grayLight,
    paddingBottom: 5,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    marginLeft: 10,
  },
  detailItemName: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  detailItemAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
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
  downloadButton: {
    marginTop: 30,
    marginBottom: 20,
  },
})

export default FeeTranscriptScreen
