const express = require('express');
const router = express.Router();

const {login , signUp , sendOTP , changePassword} = require("../controllers/Auth");

const {resetPasswordToken , resetPassword} = require("../controllers/ResetPassword");

const {auth} = require("../middlewares/auth");


// auhentication routes of user
router.post("/login",login);

router.post("/signup",signUp);

router.post("/sendotp", sendOTP);

router.post("/changepassword",auth,changePassword);


// reset password
router.post("/reset-password-token",resetPasswordToken);

router.post("/reset-password",resetPassword);

module.exports = router