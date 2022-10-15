import { IRides } from "../../../Types/IRides";
import rideModel from "../model";

export const createRide = async (query: IRides) => {
    const newRide = await rideModel.create(query)
    return newRide;
}

//: Promise<null|Record<string, unknown|string>>