import { Schema, model } from "mongoose";
import { IAuth } from "../../../Types/IAuth";
import bcrypt from 'bcryptjs'

const authSchema = new Schema({
    email: {
        type: String,
        required: "Email is a required field."
    },
    username: {
        type: String,
        required: "Username is required!"
    },
    password: {
        type: String,
        required: "Password is required!"
    },
    phoneNumber: {
        type: String,
        required: "Phone Number is required!"
    },
    expiresIn: {
        type: Number,
        default: null
    },
    token: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        required: true,
        enum: ["driver, passenger"]
    }
}, {
    timestamps: true
})

authSchema.pre('save', async function(){
    if(this.password) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})


export default model<IAuth>("Auth", authSchema)