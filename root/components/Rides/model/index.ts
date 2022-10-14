import { Schema, model } from "mongoose";

const rideSchema = new Schema({
    passenger: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedRider: {
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
        enum: ["in progress", "done", "not started"],
        default: "not started"
    }
}, {
    timestamps: true
})

const rideModel = model("Ride", rideSchema)

export default rideModel