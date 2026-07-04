const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ( to, subject, text, html ) => {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM,  // FIXED
      subject,
      text,
      html: html || (text && text.includes("<") ? text : undefined),
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error in sending mail");
    console.error(error.response?.body || error.message);
  }
};

module.exports = sendEmail;