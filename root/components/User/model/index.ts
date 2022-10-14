import { Schema, model } from "mongoose";
import { IUser } from "../../../Types/IUser";

const userSchema = new Schema({
    username: {
        type: String,
        // required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ["Driver", "passenger"]
    },
    about:{
        type: String,
        default: ''
    },
    dateOfBirth: {
        type: Date
    },
    isActive: {
        type: Boolean,
        // required: true,
    },
    authId: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    }
}, {
    timestamps: true
})


export default model<IUser>("User", userSchema)