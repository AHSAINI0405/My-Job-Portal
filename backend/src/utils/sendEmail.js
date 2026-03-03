const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    await sgMail.send({
      to,
      from: process.env.email,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error.response?.body || error.message);
  }
};

module.exports = sendEmail;