const nodemailer = require("nodemailer");
require('dotenv').config();

const mailSender = async(email,title, body) => {
    try{
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
          });
          
          
            const info = await transporter.sendMail({
              from: 'Code by Tushar',
              to: `${email}`, 
              subject: `${title}`, 
              html: `${body}`
            });
          return info;
    }catch(err){
        throw err;
    }
}

module.exports = mailSender;

