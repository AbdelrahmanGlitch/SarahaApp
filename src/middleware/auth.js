import jwt from 'jsonwebtoken';
import userModel from '../BD/models/user.model.js';
import { asyncHandler } from '../utils/errorHandling.js';

export const roles = {user : "user", admin: "admin"}
export const authentication = asyncHandler(async (req,res,next)=>{
            const {authorization} = req.headers
            const [prefix, token] = authorization.split(" ") || []
            if(!prefix || !token){
                return next(new Error("Token Not Found"))
            }
            let SIGNATURE_TOKEN = undefined;
            if(prefix == "admin") {
                SIGNATURE_TOKEN = process.env.SIGNATURE_TOKEN_ADMIN
            } else if(prefix == "bearer") {
                SIGNATURE_TOKEN = process.env.SIGNATURE_TOKEN_USER
            } else {
                return next(new Error("Invalid Token prefix"))
            }
            const decoded = jwt.verify(token, SIGNATURE_TOKEN)
            if(!decoded){
                return next(new Error("InValid Token Payload"))
            }
            const user = await userModel.findOne({_id: decoded.id})
            if(!user){
                return next(new Error("Invalied Token"))
            }
            if(user.deleted){
                return next(new Error("User Deleted"))
            }
            if(parseInt(user.passwordChangedAt.getTime()/1000) > decoded.iat){
                return next(new Error("toeken is expired, please login again"))
            }
            req.user = user
            next()
        })
export const authorization = (accessRoles = []) => {
    return asyncHandler(async (req,res,next)=>{
            const user = req.user;
            if(!accessRoles.includes(user.role)){
                return next(new Error("Access Denied"))
            }
            next()
        })
    }