import asyncError from "../Middleware/AsyncError.js";
import { sendEmail } from "../Utils/sendEmail.js";

export const contactUsC=asyncError(async(req,res)=>{

  const {name, email, message} = req.body;

  const to = process.env.MY_MAIL;
  const subject = "Contact from CourseBundler";
  const text = `I am ${name} and my Email is ${email}. \n ${message}` ;

  await sendEmail(to,subject,text);

  res.status(200).json({
    success:true,
    message:"your message has been sent"
  })
  
})