const express = require("express");
const admissionRouter = express.Router();
const controller = require("../controller/dept-admission-controller");


admissionRouter.get("/g/pending-request", controller.sendData);
admissionRouter.get("/g/admission", controller.checkAdmission);
admissionRouter.get("/g/admission-logout", controller.admissionLogOut);


admissionRouter.post("/p/admit-perm-student", controller.admitStudent);
admissionRouter.post("/p/admission-login", controller.admissionLogIn);


admissionRouter.delete("/d/delete-entity", controller.deleteEntity);


exports.admissionRouter = admissionRouter;