const express = require("express");
const router = express.Router();
const controller = require("../controller/dept-admission-controller");


router.post("/p/admit-student", controller.saveData);
router.post("/p/approve-exam/:_id", controller.approveExamRequest);
router.post("/p/admit-perm-student", controller.admitStudent);
router.post("/p/register-exam", controller.registrationReqForExam);
router.post("/p/student-login", controller.studentLogIn);
router.post("/p/student-logout", controller.studentLogOut);

router.get("/g/student", controller.checkStudent);
router.get("/g/pending-request", controller.sendData);

router.get("/g/pending-exam-req", controller.getPendingExamRequests);
router.get("/g/get-approved-pdf/:rollNumber/:semester", controller.getApprovedPdf);
router.get("/g/student-login", controller.studentLogIn);
router.get("/g/student-profile", controller.getStudentInfo);
router.get("/g/admission", controller.checkAdmission);
router.get("/g/exam", controller.checkExam);
router.get("/g/dept", controller.checkDept);


router.delete("/d/reject-exam/:_id", controller.rejectExamRequest);
router.delete("/d/delete-entity", controller.deleteEntity);




exports.router = router;