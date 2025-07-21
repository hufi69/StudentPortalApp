// src/data/dummyData.js

// Dummy data for exams
export const dummyExams = [
    {
      id: "exam_cs101_midterm_fall2025",
      courseCode: "CS101",
      courseTitle: "Programming Fundamentals",
      date: "2025-08-10",
      time: "09:00 AM",
      room: "Lab 101",
      semester: "Fall 2025",
    },
    {
      id: "exam_ma201_final_fall2025",
      courseCode: "MA201",
      courseTitle: "Calculus I",
      date: "2025-08-12",
      time: "02:00 PM",
      room: "Auditorium A",
      semester: "Fall 2025",
    },
    {
      id: "exam_ph101_midterm_fall2025",
      courseCode: "PH101",
      courseTitle: "Applied Physics",
      date: "2025-08-15",
      time: "09:00 AM",
      room: "Hall B",
      semester: "Fall 2025",
    },
  ]
  
  // Dummy data for student exam registrations
  // This links a student (by email) to specific exams
  export const dummyExamRegistrations = [
    { studentEmail: "test@university.edu.pk", examId: "exam_cs101_midterm_fall2025" },
    { studentEmail: "test@university.edu.pk", examId: "exam_ma201_final_fall2025" },
    // test@university.edu.pk is NOT registered for PH101 exam
  ]
  
  // Dummy data for student attendance (percentage for a course)
  export const dummyAttendance = [
    { studentEmail: "test@university.edu.pk", courseCode: "CS101", percentage: 90 }, // Eligible
    { studentEmail: "test@university.edu.pk", courseCode: "MA201", percentage: 60 }, // Short attendance (below 75%)
    { studentEmail: "test@university.edu.pk", courseCode: "PH101", percentage: 85 }, // Eligible
  ]
  
  // Dummy data for student fee status
  export const dummyFeeStatus = [
    { studentEmail: "test@university.edu.pk", isDefaulter: false }, // Not a defaulter
    { studentEmail: "another@university.edu.pk", isDefaulter: true }, // Defaulter
  ]
  
  // Dummy data for fee transcript
  export const dummyFeeTranscript = [
    {
      semester: "Fall 2023",
      totalFee: 150000,
      paidAmount: 150000,
      dueDate: "2023-09-15",
      status: "Paid",
      details: [
        { item: "Tuition Fee", amount: 120000 },
        { item: "Lab Charges", amount: 15000 },
        { item: "Library Fee", amount: 5000 },
        { item: "Sports Fee", amount: 10000 },
      ],
    },
    {
      semester: "Spring 2024",
      totalFee: 155000,
      paidAmount: 155000,
      dueDate: "2024-02-20",
      status: "Paid",
      details: [
        { item: "Tuition Fee", amount: 125000 },
        { item: "Lab Charges", amount: 15000 },
        { item: "Library Fee", amount: 5000 },
        { item: "Examination Fee", amount: 10000 },
      ],
    },
    {
      semester: "Fall 2024",
      totalFee: 160000,
      paidAmount: 100000, // Partially paid
      dueDate: "2024-09-10",
      status: "Partially Paid",
      details: [
        { item: "Tuition Fee", amount: 130000 },
        { item: "Lab Charges", amount: 15000 },
        { item: "Library Fee", amount: 5000 },
        { item: "Sports Fee", amount: 10000 },
      ],
    },
    {
      semester: "Spring 2025",
      totalFee: 165000,
      paidAmount: 0, // Unpaid
      dueDate: "2025-02-15",
      status: "Due",
      details: [
        { item: "Tuition Fee", amount: 135000 },
        { item: "Lab Charges", amount: 15000 },
        { item: "Library Fee", amount: 5000 },
        { item: "Examination Fee", amount: 10000 },
      ],
    },
  ]
  