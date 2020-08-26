const nodemailer = require('nodemailer');
//pass: \Ny4Z<hQyqW^&fpR
//emal: 029.web2.17ck1@gmail.com
const EMAIL = process.env.USER_EMAIL || '029.web2.17ck1@gmail.com';
const PASSWORD = process.env.USER_PASSWORD || '\\Ny4Z<hQyqW^&fpR'; 

async function send(to , subject, content){
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: EMAIL, 
      pass: PASSWORD, 
    },tls: {
      rejectUnauthorized: false
    }
  });

  let info = await transporter.sendMail({
    from: process.env.EMAIL_FROM, 
    to, 
    subject, 
    text: content
  });
}
module.exports = {send}