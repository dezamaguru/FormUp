const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: {
      name: "FormUp",
      address: process.env.USER,
    },
    to,
    subject,
    html,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email trimis:", info.messageId);
  } catch (error) {
    console.error("Eroare la trimiterea emailului:", error);
  }
};

module.exports = { sendEmail };
