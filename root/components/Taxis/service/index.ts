import { INewTaxi, ITaxi } from "../../../Types/ITaxi";
import routeModel from "../../TaxiRoutes/model";
import { taxiModel } from "../model";

export const addNewTaxi = async (payload: INewTaxi) => {
    const checkTaxi = await taxiModel.findOne({plateNumber: payload.plateNumber})
    if (checkTaxi) return "taxi with this plateNumber already exists!"

    const getRoute = await routeModel.findOne({from: payload.from, to: payload.to})
    const newTaxi = await taxiModel.create({...payload, route: getRoute?._id})
    return newTaxi
}

export const updateTaxiCred = async (query: ITaxi) => {

}