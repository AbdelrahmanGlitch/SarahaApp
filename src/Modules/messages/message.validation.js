import joi from 'joi';
import { generalRoules } from "../../utils/generalRules.js"

export const sendMessageSchema = {
    body: joi.object({
        content: joi.string().min(1).max(800),
        userId: generalRoules.id
    }).required()
}