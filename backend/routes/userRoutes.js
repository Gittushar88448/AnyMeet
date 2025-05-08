const express = require('express');
const { signup, login, sendOtp } = require('../controllers/AuthController');
const router = express.Router();

router.post("/signup", signup);
router.post('/login',login);
router.post('/send-otp', sendOtp);

module.exports = router;