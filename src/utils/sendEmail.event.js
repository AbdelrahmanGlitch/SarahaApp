import {EventEmitter} from "events"
import { generateToken } from "./token/generateToken.js";
import { asyncHandler } from "./errorHandling.js";
import { sendEmail } from './../services/sendEmail.js';
export const eventEmiter = new EventEmitter()

eventEmiter.on("sendEmail", async (data)=>{
    const {email} = data
    const token = await generateToken({
        payload: email,
        SIGNATURE: process.env.SIGNATURE_EMAIL,
        option: {expiresIn: "1d"}
    })
    const link = `http://localhost:3000/users/confirmEmail/${token}`
    const emailSender = await sendEmail(email, "Email Confirmation", `<a href='${link}'>Click Here To Confirm Your Email</a>`)
    if(!emailSender){
        return next(new Error("Failed To Confirm Email",{cause: 500}))
    }
})