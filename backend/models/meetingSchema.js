const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    meeting_code: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Meeting', meetingSchema);