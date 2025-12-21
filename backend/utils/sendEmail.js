// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ashwinv.projects@gmail.com",
      pass: "qgmi npvq anwy dfil",
    },
  });

  await transporter.sendMail({
    from: "ashwinv.projects@gmail.com",
    to: email,
    subject,
    text: message,
  });
};

module.exports = sendEmail;
