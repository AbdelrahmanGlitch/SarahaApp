import cors from "cors";
import connectionDB from "./BD/connectionDB.js";
import messageRouter from "./Modules/messages/message.controller.js";
import userRouter from "./Modules/users/user.controller.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const booystrap = async (app, express) => {
    app.use(cors());
    app.use(express.json());
    app.get("/", (req,res,next)=>{
        return res.status(200).json({msg: "Hello to saraha project"})
    })
    connectionDB()
    app.use("/users", userRouter)
    app.use("/message", messageRouter)


    app.use("/", (req,res,next)=>{
        return next(new Error(`inValied Url ${req.originalUrl} !`))
    })
    app.use(globalErrorHandling)
}

export default booystrap;