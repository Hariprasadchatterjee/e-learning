import { createTransport } from "nodemailer"

export const sendEmail= async(to,sebject,text)=>{
  const transporter = createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMPT_USER,
      pass: process.env.SMPT_PASSWORD,
    }
  });

  await transporter.sendMail({
    to,
    sebject,
    text,
   
  })
}