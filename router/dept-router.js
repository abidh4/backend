const express = require("express");
const deptRouter = express.Router();
const controller = require("../controller/dept-admission-controller");

deptRouter.post("/p/admit-student", controller.saveData);
deptRouter.post("/p/dept-login", controller.deptLogIn);


deptRouter.get("/g/dept", controller.checkDept);
deptRouter.get("/g/dept-logout", controller.deptLogOut);


exports.deptRouter = deptRouter;
