const nodemailer = require('nodemailer');
const { mailGenerator } = require('../config/mail');

const email = process.env.EMAIL_ADDRESS
const password = process.env.PASSWORD

exports.sendEmail = (subject, recipient, body) => {
    
    const mailOptions = {
        from: `Hackton <hackton@portal>`,
        to: recipient,
        subject: subject,
        html: body
    }
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password,
        }
    });

    transporter.sendMail(mailOptions)
};


  