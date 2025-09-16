const express = require("express");
const admissionRouter = express.Router();
const controller = require("../controller/dept-admission-controller");


admissionRouter.get("/g/pending-request", controller.sendData);
admissionRouter.get("/g/admission", controller.checkAdmission);

admissionRouter.post("/p/admit-perm-student", controller.admitStudent);
admissionRouter.delete("/d/delete-entity", controller.deleteEntity);
admissionRouter.post("/p/admission-login", controller.admissionLogIn);


exports.admissionRouter = admissionRouter;