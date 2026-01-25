const emailjs = require("@emailjs/nodejs");

const sendEmail = async ({ to, subject, html }) => {
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: to,
        subject: subject,
        message: html,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("Email sent successfully");
  } catch (error) {
    console.error("EmailJS Error:", error);
    throw error;
  }
};

module.exports = sendEmail;



// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false, // IMPORTANT
//   auth: {
//     user: process.env.BREVO_SMTP_USER,
//     pass: process.env.BREVO_SMTP_KEY,
//   },
//   tls: {
//     rejectUnauthorized: false, // IMPORTANT for Render
//   },
//   connectionTimeout: 10000, // 10 seconds
// });

// const sendEmail = async ({ to, subject, html }) => {
//   await transporter.sendMail({
//     from: `"Job Portal" <${process.env.BREVO_SMTP_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

// module.exports = sendEmail;
