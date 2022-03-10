const { createUser, userLog } = require('../controllers/Users')

const express = require("express");
const userRouter = express.Router();

userRouter.post("/signup", createUser)
userRouter.post("/login", userLog)

module.exports = { userRouter }