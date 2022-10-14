import { ITaxi } from "../../../Types/ITaxi";
import { taxiModel } from "../model";

export const addNewTaxi = async (payload: ITaxi) => {
    const checkTaxi = await taxiModel.findOne({plateNumber: payload.plateNumber})
    if (checkTaxi) return "taxi with this plateNumber already exists!"

    const newTaxi = await taxiModel.create(payload)
    return newTaxi
}

export const updateTaxiCred = async (query: ITaxi) => {
    
}