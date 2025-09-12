const deptAdmissionModel = require("../model/admission-candidate-list");
const bcrypt = require("bcrypt");
const admittedStudentModel = require("../model/admitted-student-list");
const examRegistrationReqModel = require("../model/exam-registration-request-list");
const RegisteredExamineeModel = require("../model/registered-examinee-list");
const PDFDocument = require("pdfkit");
const stream = require("stream");
exports.saveData = async(req, res, next) => {
  const { studentName,fathersName,mothersName,deptName,studentSession,gender,contactNo, eMail,address,meritPosition} = req.body;
  const studentData = new deptAdmissionModel(
  {studentName,fathersName,mothersName,deptName,studentSession,gender,contactNo,eMail, address,meritPosition}
  );
  try{
    await studentData.save().then(() => {
    console.log("Data Saved to MongoDB Successfully!");
  });
  res.json({status: true});
  }catch(err){
    console.log("Error occured while saving data to MongoDB", err);
    res.json({status: false, error: err});
  }
};


exports.sendData = async (req, res, next) => {
  try {
    const candidates = await deptAdmissionModel.find();
    if (!candidates || candidates.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(candidates);

  } catch (error) {
    console.error("Error fetching admission candidates:", error);
    res.status(500).json({
      message: "Failed to fetch admission candidates",
      error: error.message
    });
  }
};


exports.deleteEntity = async (req, res,next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "Student ID is required" });
    }

    const deleted = await deptAdmissionModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student rejected and deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ success: false, message: "Server error while deleting student", error: error.message });
  }
};

   // admitted students

exports.admitStudent = async (req, res,next) => {
  const { _id, rollNumber, hallName, password } = req.body;

  if (!_id || !rollNumber || !hallName || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Find the student in pending requests
    const pendingStudent = await deptAdmissionModel.findById(_id);
    if (!pendingStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admitted student document
    const admittedStudent = new admittedStudentModel({
      rollNumber,
      hallName,
      password: hashedPassword,
      studentName: pendingStudent.studentName,
      fathersName: pendingStudent.fathersName,
      mothersName: pendingStudent.mothersName,
      deptName: pendingStudent.deptName,
      studentSession: pendingStudent.studentSession,
      gender: pendingStudent.gender,
      contactNo: pendingStudent.contactNo,
      eMail: pendingStudent.eMail,
      address: pendingStudent.address,
      meritPosition: pendingStudent.meritPosition
    });

    await admittedStudent.save();

    // Delete the student from pending requests
    await deptAdmissionModel.findByIdAndDelete(_id);

    res.json({ success: true, message: "Student admitted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.getAdmittedStudents = async (req, res,next) => {
  try {
    //const roll = req.user?.roll || req.query.roll ;
     const roll = 12209008;

    if (!roll) {
      return res.status(400).json({ error: "Roll number is required" });
    }

    const student = await admittedStudentModel.findOne({ rollNumber:roll });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student); 
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




exports.registrationReqForExam = async (req, res, next) => {
  try {
    const { rollNumber, examType, eMail, semester, courses, payableAmount, trxID } = req.body;

    // 1. Validate required fields
    if (!rollNumber || !examType || !eMail || !semester || !Array.isArray(courses) || courses.length === 0 || !trxID) {
      return res.status(400).json({
        message: "rollNumber, examType, eMail, semester, courses (array), and trxID are required",
      });
    }

    if (courses.length > 12) {
      return res.status(400).json({
        message: "You can select up to 12 courses only",
      });
    }

    // 2. Check for duplicate registration (same rollNumber, examType, semester)
    const existingRequest = await examRegistrationReqModel.findOne({
      rollNumber,
      examType,
      semester
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "You have already registered for this exam type and semester",
      });
    }

    // 3. Create new registration
    const newRegistration = new examRegistrationReqModel({
      rollNumber,
      examType,
      eMail,
      semester,
      courses,
      payableAmount: payableAmount || 5000,
      trxID,
      status: "Pending" // set default status
    });

    const savedRegistration = await newRegistration.save();

    // 4. Return success
    return res.status(201).json({
      message: "Exam registration request created successfully",
      data: savedRegistration,
    });

  } catch (error) {
    console.error("Error in exam registration:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



exports.getPendingExamRequests = async (req, res) => {
  try {
    // Fetch all requests with status "Pending"
    const pendingRequests = await examRegistrationReqModel.find({ status: "Pending" }).sort({ date: -1 });

    // If no pending requests, return empty array
    if (!pendingRequests || pendingRequests.length === 0) {
      return res.status(200).json([]);
    }

    // Return the data
    res.status(200).json(pendingRequests);

  } catch (error) {
    console.error("Error fetching pending exam requests:", error);
    res.status(500).json({
      message: "Server error while fetching pending requests",
      error: error.message
    });
  }
};




exports.approveExamRequest = async (req, res) => {
  try {
    const requestId = req.params._id;
    const request = await examRegistrationReqModel.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    let student = await RegisteredExamineeModel.findOne({ rollNumber: request.rollNumber });

    // Prevent same semester registration
    if (student && student.registeredFor.some(e => (e.semester === request.semester &&   e.examType === request.examType))) {
      return res.status(409).json({ message: `Student already registered for semester ${request.semester}` });
    }

    // Generate PDF
    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBase64 = Buffer.concat(buffers).toString("base64");

      const newExam = {
        examType: request.examType,
        semester: request.semester,
        date: request.date,
        courses: request.courses,
        paymentStatus: "Paid",
        pdfBase64
      };

      if (student) {
        student.registeredFor.push(newExam);
        await student.save();
      } else {
        student = new RegisteredExamineeModel({
          rollNumber: request.rollNumber,
          eMail: request.eMail,
          registeredFor: [newExam]
        });
        await student.save();
      }

      // Delete the pending request
      await examRegistrationReqModel.findByIdAndDelete(requestId);

      res.status(200).json({ message: "Request approved successfully" });
    });

    // University Header
doc.fontSize(22).text("Comilla University", { align: "center", bold: true });
doc.fontSize(14).text("Kotbari, Cumilla-3506, Bangladesh", { align: "center" });
doc.moveDown();
doc.fontSize(18).text("Exam Registration Approval Receipt", { align: "center", underline: true });
doc.moveDown(2);

// Student Information
doc.fontSize(14).text(" Student Information", { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text(`Roll Number: ${request.rollNumber}`);
doc.text(`Email: ${request.eMail}`);
doc.moveDown();

// Exam Details
doc.fontSize(14).text(" Exam Details", { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text(`Exam Type: ${request.examType}`);
doc.text(`Semester: ${request.semester}th`);
doc.text(`Date of Registration: ${request.date.toDateString()}`);
doc.text(`Registered Courses: ${request.courses.join(", ")}`);
doc.moveDown();

// Payment Status
doc.fontSize(14).text("Payment Status", { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text("Status: Paid", { continued: true }).fillColor("green");
doc.fillColor("black"); // reset color
doc.moveDown(2);

// Footer
doc.fontSize(10).text("For any query contact ICT Cell,CoU", { align: "center", italics: true });
doc.end();


  } catch (err) {
    console.error("Error approving request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.rejectExamRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await examRegistrationReqModel.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    await examRegistrationReqModel.findByIdAndDelete(requestId);
    res.status(200).json({ message: "Request rejected and deleted successfully" });

  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




exports.getApprovedPdf = async (req, res) => {
  try {
    const { rollNumber, semester } = req.params;

    const student = await RegisteredExamineeModel.findOne({ rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const exam = student.registeredFor.find(e => e.semester === parseInt(semester));
    if (!exam || !exam.pdfBase64) return res.status(404).json({ message: "PDF not found" });

    res.status(200).json({ pdfBase64: exam.pdfBase64 });
  } catch (err) {
    console.error("Error fetching PDF:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


