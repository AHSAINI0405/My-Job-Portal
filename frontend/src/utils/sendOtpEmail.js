import emailjs from "@emailjs/browser";

export const sendOtpEmail = (email, otp) => {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      to_email: email,
      otp,
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};
