import { Schema, model } from "mongoose";
import { ITaxi } from "../../../Types/ITaxi";

const taxiSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    currentDriver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    route: {
        type: Schema.Types.ObjectId,
        ref: "Route"
    },
    number: {
        type: String
    },
    plateNumber: {
        type: String,
        required: true
    },
    capacity: {
        type: String,
        required: true
    },
    seatsTaken: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const taxiModel = model<ITaxi>("Taxi", taxiSchema)