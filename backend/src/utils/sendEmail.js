const emailjs = require("@emailjs/nodejs");

const sendEmail = async ( to, subject, text, html ) => {
  try {
    // Robustly extract 6-digit OTP if it exists in the message body
    const otpMatch = text ? text.match(/\b\d{6}\b/) : null;
    const otp = otpMatch ? otpMatch[0] : "";

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: to,
        email: to,
        to: to,
        user_email: to,
        recipient: to,
        subject: subject,
        message: html || text,
        otp: otp,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("Email sent successfully via EmailJS");
  } catch (error) {
    console.log("Error in sending mail via EmailJS");
    console.error(error);
  }
};

module.exports = sendEmail;