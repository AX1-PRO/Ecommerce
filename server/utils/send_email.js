import nodemailer from "nodemailer"
let send_email=async({email,subject,message})=>{
    //create transporter Gmail
    let transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        secure:true,
        port: process.env.GMAIL_PORT,

auth:{
    user: process.env.GMAIL_NAME,
    pass: process.env.GMAIL_PASSWORD
}
    })
    let mail_option={
        from:"<E-commerse_BX1>",
        to:email,
        subject:subject,
        text:message
    }
    
    await transporter.sendMail(mail_option)
}
export default send_email