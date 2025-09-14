const express = require("express");
const studentRouter = express.Router();
const controller = require("../controller/dept-admission-controller");


studentRouter.get("/g/student", controller.checkStudent);
studentRouter.get("/g/student-profile", controller.getStudentInfo);
studentRouter.get("/g/get-approved-pdf/:rollNumber/:semester", controller.getApprovedPdf);



studentRouter.post("/p/student-logout", controller.studentLogOut);
studentRouter.post("/p/student-login", controller.studentLogIn);
studentRouter.post("/p/register-exam", controller.registrationReqForExam);

exports.studentRouter = studentRouter;
