import { model, Schema } from "mongoose";

const taxiRouteSchema = new Schema ({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const routeModel = model("Route", taxiRouteSchema)

export default routeModel