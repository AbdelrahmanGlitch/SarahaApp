import userModel from "../../BD/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import messageModel from './../../BD/models/message.model.js';

export const sendMessage = asyncHandler(async (req,res,next)=> {
    const {content, userId} = req.body;
    if(!await userModel.findOne({_id: userId, deleted: false})){
        return next(new Error("Can't send this message as this user is not found"))
    }
    const message = await messageModel.create({content, userId});
    return res.status(200).json({msg: "Done", message})
})
export const getMessage = asyncHandler(async (req,res,next)=>{
    const messages = await messageModel.find({userId: req.user._id}).populate("userId","name email")
    return res.status(200).json({msg: "done",messages})
})