import userModel from './../../BD/models/user.model.js';
import jwt from "jsonwebtoken";
import { sendEmail } from '../../services/sendEmail.js';
import joi from 'joi';
import { asyncHandler } from '../../utils/errorHandling.js';
import { eventEmiter } from '../../utils/sendEmail.event.js';
import { Hash } from '../../utils/hash/hash.js';
import { compare } from '../../utils/hash/compare.js';
import { Encrypt } from './../../utils/encrypt/encrypt.js';
import { Decrypt } from './../../utils/encrypt/decrypt.js';
import { generateToken } from '../../utils/token/generateToken.js';
import { verifyToken } from './../../utils/token/verifyToken.js';
import messageModel from '../../BD/models/message.model.js';

export const signUp = asyncHandler(async (req,res,next) => {
        const {name, email, password, cPassword, phone, gender} = req.body
        if(password !== cPassword) {
            return next(new Error("Passwords do not match", {cause: 400}))
        }
        const emailExist = await userModel.findOne({email})
        if(emailExist) {
            return next(new Error("Email already exist.",{cause: 409}))
        }
        const hash = await Hash({password, SALT_ROUND: +process.env.SALT_ROUND})
        const phonecrypt = await Encrypt({phone, SECRET_KEY: process.env.SECRET_KEY})
        eventEmiter.emit("sendEmail",{email})
        const user = await userModel.create({name, email, password: hash, phone: phonecrypt, gender})
        return res.status(201).json({msg: "user Created successfully", user})
})
export const confirmEmail = asyncHandler( async (req,res,next) => {
        const {token} = req.params
        if(!token){
            return next(new Error("Token Not Found!"))
        }
        const decoded = await verifyToken({token, SIGNATURE: process.env.SIGNATURE_EMAIL})
        if(!decoded) {
            return next(new Error("Invalid Token Payload!"))
        }
        const user = await userModel.findOne({email: decoded})
        if(!user) {
            return next(new Error("User not found"))
        }
        if(user.confirmed) {
            return next(new Error("Email already confirmed"))
        }
        user.confirmed = true
        await user.save() // to save changes after getting the user data
        return res.status(200).json({msg: "Email confirmed successfully"})
})
export const signIn = asyncHandler( async (req,res,next) => {
        const {email , password} = req.body
        const user = await userModel.findOne({email})
        if(!user) {
            return next(new Error("Invalied Email"))
        }
        if(!user.confirmed) {
            return next(new Error("Please chick your email to confirm before signing in"))
        }
        const match = await compare({password, userPassword: user.password})
        if(!match) {
            return next(new Error("Incorrect Password"))
        }
        const token = await generateToken({
            payload: {email, id: user._id},
            SIGNATURE : user.role == "user" ? process.env.SIGNATURE_TOKEN_USER : process.env.SIGNATURE_TOKEN_ADMIN,
            option: {expiresIn: "1d"}
        })
        if(user.deleted){
            return next(new Error("This User is Deleted"))
        }
        return res.status(202).json({msg: "SignIn Success", token})
})
export const getPorfile = asyncHandler(async (req,res,next)=>{
        const user = req.user
        req.user.phone = await Decrypt({phone : user.phone , SECRET_KEY: process.env.SECRET_KEY});
        const messages = await messageModel.find({userId: req.user._id})
        return res.status(201).json({msg: "success", user, messages})
})
export const updatePorfile = asyncHandler(async (req,res,next)=>{
    const {phone} = req.body;
    if(phone){
        req.body.phone = await Encrypt({phone, SECRET_KEY: process.env.SECRET_KEY})
    }
    const user = await userModel.findByIdAndUpdate(req.user._id,req.body, {new: true})
    return res.status(200).json({msg: "User Updated Successfully", user})
})
export const updatePassword= asyncHandler(async (req,res,next)=>{
    const {oldPassword, newPassword, cNewPassword} = req.body;
    if(newPassword !== cNewPassword){
        return next(new Error("Password and rePassword are not matched"))
    }
    if(!await compare({password: oldPassword, userPassword: req.user.password})){
        return next(new Error("Invalid oldPassword"))
    }
    if(oldPassword == newPassword){
        return next(new Error("Please enter a new password as this password is used already before"))
    }
    const hash = await Hash({password : newPassword, SALT_ROUND: +process.env.SALT_ROUND})
    const user = await userModel.findOneAndUpdate(req.user._id, {password: hash, passwordChangedAt: Date.now()}, {new: true})
    return res.status(200).json({msg: "Password Updated Successfully", user})
})
export const freezeAccount = asyncHandler(async (req,res,next)=>{
    const user = await userModel.findOneAndUpdate(req.user._id, {deleted: true, passwordChangedAt: Date.now()}, {new: true})
    return res.status(200).json({msg: "User Deleted Successfully", user})
})
export const shareProfile = asyncHandler(async (req,res,next)=>{
    const user = await userModel.findOne({_id: req.params.id}).select("name email")
    if(!user){
        return next(new Error("User not found"))
    }
    return res.status(200).json({msg: "profile found", user})
})