import joi from "joi"
import { generalRoules } from "../../utils/generalRules.js"


export const signUpSchema = {
    body: joi.object({
        name: joi.string().alphanum().min(3).max(20).required().messages({
            "sting.min": "Name is too short",
            "string.max": "Name is too tall"
        }),
        email: generalRoules.email,
        password: generalRoules.password.required(),
        cPassword: joi.string().valid(joi.ref("password")).required(),
        gender: joi.string().valid("Male","Female").required(),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/).required()
    }).with("password", "cPassword").with("email","password")
}
export const updatePasswordSchema = {
    body: joi.object({
        oldPassword: generalRoules.password.required(),
        newPassword: generalRoules.password.required(),
        cNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
    }).with("newPassword", "cNewPassword")
}
export const freezeAccountSchema = {
    headers: generalRoules.headers.required()
}