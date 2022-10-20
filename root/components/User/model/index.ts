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
        enum: ["driver", "passenger"]
    },
    status: {
        type: String,
        enum: ["enabled", "disabled"],
        required: true
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
    },
    currentRide: {
        type: Schema.Types.ObjectId,
        ref: "Ride"
    },
    avatar: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})


export default model("User", userSchema)