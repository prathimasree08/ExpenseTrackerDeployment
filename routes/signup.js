const express = require("express");
const Router = express.Router();

const userController = require("../controller/user");

Router.post("/user/signup", userController.postSignUpUser);

module.exports = Router;
