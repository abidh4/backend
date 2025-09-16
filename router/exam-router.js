const express = require("express");
const examRouter = express.Router();
const controller = require("../controller/dept-admission-controller");



examRouter.delete("/d/reject-exam/:_id", controller.rejectExamRequest);
examRouter.post("/p/approve-exam/:_id", controller.approveExamRequest);

examRouter.get("/g/pending-exam-req", controller.getPendingExamRequests);
examRouter.get("/g/exam", controller.checkExam);
examRouter.post("/p/exam-login", controller.examLogIn);

exports.examRouter = examRouter;