const User = require('../models/userSchema');
const Meeting = require('../models/meetingSchema');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getUserHistroy = async (req, res) => {
    try {
        let { token } = req.query;
        token = token.replace(/"/g, '');

        const decode = await jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decode._id});

        const meetings = await Meeting.find({ user_id: user._id });

        if (meetings.length) {
            res.status(200).json({
                success: true,
                meetings
            });
        } else {
            res.status(404).send('No meetings found')
        }
    } catch (error) {
        console.log(error)
    }

}

exports.addToHistory = async (req, res) => {
    const { meetingCode } = req.body;
    try {
        let token = req.headers.authorization.replace(`Bearer `, "");
        token = token.replace(/"/g, '');
        const decode =  jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decode._id});
        // console.log(user)
        const newMeeting = new Meeting({
            user_id: user._id,
            meeting_code: meetingCode
        });

        const newmeeting = await newMeeting.save();
        if (newmeeting) {
            res.status(200).json({
                newmeeting
            })
        }


    } catch (error) {
        console.log(error)
    }
}