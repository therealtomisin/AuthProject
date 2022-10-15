import { Response } from "express";
import { CustomReq } from "../../../Types/CustomReq";
import { createRoute } from "../service";

export const postCreateRoute = async (req: CustomReq, res: Response) => {
    const {from, to} = req.body
    const output = await createRoute(from, to)

    res.status(200).json(output)
}