import { Response } from "express";
import { CustomReq } from "../../../Types/CustomReq";
import { addNewTaxi } from "../service";

export const postAddTaxi = async (req: CustomReq, res: Response) => {
    const {name, from, to, plateNumber, capacity} = req.body
    const output = await addNewTaxi({name, from, to, plateNumber, capacity})

    res.status(200).json(output)
}