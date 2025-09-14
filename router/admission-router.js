const express = require("express");
const admssionRouter = express.Router();
const controller = require("../controller/dept-admission-controller");


admssionRouter.get("/g/pending-request", controller.sendData);
admssionRouter.get("/g/admission", controller.checkAdmission);

admssionRouter.post("/p/admit-perm-student", controller.admitStudent);
admssionRouter.delete("/d/delete-entity", controller.deleteEntity);


exports.admssionRouter = admssionRouter;