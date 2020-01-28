const nodemailer = require('nodemailer');

const email = process.env.EMAIL_ADDRESS
const password = process.env.PASSWORD

exports.sendEmail = (subject, recipient, body) => {
    const mailOptions = {
        from: `Hackton <hackton@portal>`,
        to: recipient,
        subject: subject,
        html: body,
        text: 'I hope this message gets through!',
    }
    
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: email,
    //         pass: password,
    //     }
    // });

    transporter.sendMail(mailOptions)
};


  