# Fix Register/Login Security Issues

## Completed Tasks
- [x] Fix typo in backend/src/controllers/email.controller.js (sendMail -> sendEmail)
- [x] Switch backend/src/utils/sendEmail.js from EmailJS to Nodemailer with Brevo SMTP
- [x] Enable email sending in backend/src/controllers/auth.controller.js register function
- [x] Fix resendOTP function to not return OTP in response
- [x] Remove frontend EmailJS OTP sending from Register.jsx
- [x] Remove frontend EmailJS OTP sending from Login.jsx
- [x] Update resendOTP to send email via backend

## Pending Tasks
- [ ] Set BREVO_SMTP_USER and BREVO_SMTP_KEY environment variables in Render dashboard
- [ ] Test email sending functionality after deployment
- [ ] Test secure authentication flow
