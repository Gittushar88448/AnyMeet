const User = require('../models/userSchema');
const OTP = require('../models/otpSchema');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(404).json({
                success: false,
                message: 'credientials not found!'
            })
        }

        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.json({
                success: true,
                message: "User already exists!!"
            })
        }
        let otp;
        otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        const checkOtp = await OTP.findOne({otp});

        while (checkOtp) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            checkOtp = await OTP.findOne({otp})
        };
        console.log(otp)
        const newOtp = await OTP.create({
            otp: otp,
            email: email
        })
        if (newOtp) {
            return res.status(200).json({
                success: true,
                message: "otp send successfully",
                newOtp
            })
        }
    } catch (err) {
        throw err
    }
}

exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, password, email, confirmPassword, otp } = req.body;

        if (!firstName || !lastName  || !password || !confirmPassword || !email || !otp) {
            return res.status(404).json({
                success: false,
                message: "please enter all the credentials"
            });
        }

        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: 'password not matched!'
            })
        }

        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }

        const recentOtp = await OTP.findOne({email}).sort({ createdAt: -1 }).limit(1);
        if (recentOtp.length === 0) {
            return res.json({
                success: false,
                message: "otp not found"
            })
        }

        if (otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "otp not matched!!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createUser = await User.create({
            firstName,
            lastName,
            password,
            email,
            password: hashedPassword,
        })

        res.status(200).json({
            success: true,
            message: "user created successfully!",
            newUser: createUser
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
        throw err;
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send({
                message: "please enter the valid credientials"
            });
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.send({
                message: "User is not found, please registered first"
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                _id: user._id,
                email: user.email
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h'
            });

            user.access_token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            const cooki = res.cookie('token', token, options);

            if (cooki) {
                res.status(200).json({
                    success: true,
                    message: 'cookie has been send',
                    user,
                    token
                })
            }
        } else {
            return res.status(401).json({
                success: false,
                message: "Incorrect password. Please try again."
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}