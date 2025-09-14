const express = require("express");
const deptAdmissionRouter = express.Router();
const controller = require("../controller/dept-admission-controller");


deptAdmissionRouter.post("/admit-student", controller.saveData);
deptAdmissionRouter.post("/approve-exam/:_id", controller.approveExamRequest);
deptAdmissionRouter.post("/admit-perm-student", controller.admitStudent);
deptAdmissionRouter.post("/register-exam", controller.registrationReqForExam);
deptAdmissionRouter.post("/student-login", controller.studentLogIn);
deptAdmissionRouter.post("/student-logout", controller.studentLogOut);

deptAdmissionRouter.get("/student", controller.checkStudent);
deptAdmissionRouter.get("/pending-request", controller.sendData);

deptAdmissionRouter.get("/pending-exam-req", controller.getPendingExamRequests);
deptAdmissionRouter.get("/get-approved-pdf/:rollNumber/:semester", controller.getApprovedPdf);
deptAdmissionRouter.get("/student-login", controller.studentLogIn);
deptAdmissionRouter.get("/student-profile", controller.getAdmittedStudents);
deptAdmissionRouter.get("/admission", controller.checkAdmission);
deptAdmissionRouter.get("/exam", controller.checkExam);
deptAdmissionRouter.get("/dept", controller.checkDept);


deptAdmissionRouter.delete("/reject-exam/:_id", controller.rejectExamRequest);
deptAdmissionRouter.delete("/delete-entity", controller.deleteEntity);




exports.deptAdmissionRouter = deptAdmissionRouter;