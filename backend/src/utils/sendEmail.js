const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ( to, subject, text ) => {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM,  // FIXED
      subject,
      text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error in sending mail");
    console.error(error.response?.body || error.message);
  }
};

module.exports = sendEmail;