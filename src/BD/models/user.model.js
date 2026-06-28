import mongoose from "mongoose";
import { roles } from "../../middleware/auth.js";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        lowercase: [true, "Name Must be Lower Case"],
        minLength: 3,
        maxLength: 20
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: [true, "Email Must be Lower Case"],
        unique: [true, "Email Must Be Unique"],
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Minimum Length is 8 Charicters"]
    },
    phone: {
        type: String,
        required: [true, "Phone is required"]
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
        default: "Male"
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.user
    },
    passwordChangedAt: Date,
    deleted:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    capped: {
        size: 10000 
    }
})

const userModel = mongoose.model("User", userSchema)

export default userModel;