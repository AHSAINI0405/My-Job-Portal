const emailjs = require("@emailjs/nodejs");

const sendEmail = async ( to, subject, text, html ) => {
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: to,
        subject: subject,
        message: html || text,
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