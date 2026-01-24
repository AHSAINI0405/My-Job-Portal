const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // IMPORTANT
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
  tls: {
    rejectUnauthorized: false, // IMPORTANT for Render
  },
  connectionTimeout: 10000, // 10 seconds
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Job Portal" <${process.env.BREVO_SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
