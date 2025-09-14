const express = require("express");
const deptRouter = express.Router();
const controller = require("../controller/dept-admission-controller");

deptRouter.post("/p/admit-student", controller.saveData);
deptRouter.get("/g/dept", controller.checkDept);

exports.deptRouter = deptRouter;
