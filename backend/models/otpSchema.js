const mongoose = require('mongoose');
const mailSender = require('../service/mail_config');
const otpTemplate = require('../mail_template/otp_template');

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60
    }
});

async function sendVerificationMail(email, otp){
    try{
        const sendingMail = await mailSender(email, 'Verification Mail By Zoom', otpTemplate(otp));
        return sendingMail;
    }catch(err){
        throw err;
    }
}

otpSchema.pre('save', async function(next) {
    if(this.isNew){
         await sendVerificationMail(this.email, this.otp);
    }
    next();
})

module.exports = mongoose.model('OTP', otpSchema); 