import { Router } from "express";
import { confirmEmail, freezeAccount, getPorfile, shareProfile, signIn, signUp, updatePassword, updatePorfile } from "./user.service.js";
import { authentication, authorization, roles } from "../../middleware/auth.js";
import { validation } from './../../middleware/validation.js';
import { freezeAccountSchema, signUpSchema, updatePasswordSchema } from "./user.validate.js";

const userRouter = Router();

userRouter.post("/signUp",validation(signUpSchema), signUp)
userRouter.post("/signIn", signIn)
userRouter.get("/confirmEmail/:token", confirmEmail)
userRouter.get("/profile",authentication,authorization(roles.user), getPorfile)
userRouter.get("/profile/:id", shareProfile)
userRouter.patch("/update",authentication,authorization(roles.user), updatePorfile)
userRouter.patch("/update/password",validation(updatePasswordSchema), authentication,authorization(roles.user), updatePassword)
userRouter.delete("/freezeAccount",validation(freezeAccountSchema), authentication,authorization(roles.user), freezeAccount)


export default userRouter;