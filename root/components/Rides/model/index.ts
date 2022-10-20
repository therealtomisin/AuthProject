import { Schema, model } from "mongoose";
import { IRides } from "../../../Types/IRides";

const rideSchema = new Schema({
    passengers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    assignedRider: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTaxi: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    routeId: {
        type: Schema.Types.ObjectId,
        ref: "Route",
        required: true
    },
    status: {
        type: String,
        enum: ["inProgress", "ended", "yetToStart"],
        default: "not started"
    },
    rating: {
        type: String,
    }
}, {
    timestamps: true
})

const rideModel = model<IRides>("Ride", rideSchema)

export default rideModel