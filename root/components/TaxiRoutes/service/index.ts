import routeModel from "../model"

export const createRoute = async (from:string, to: string) => {
    const check = await routeModel.findOne({from, to})
    if(check) return "this route already exists."

    const newRoute = await routeModel.create({from, to})
    return newRoute
}