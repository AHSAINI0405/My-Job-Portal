const nodeMailer=require('nodemailer');
const sendEmail=async({to,subject,html})=>{
    const transporter=nodeMailer.createTransport({
            service:"gmail",
            auth:{
                email:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
    })
    await transporter.sendMail({
        from:`JOB Portal`,
        to,
        subject,
        html
    })
}
module.exports=sendEmail;