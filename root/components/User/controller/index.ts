import { Request, Response } from "express";
import { CustomReq } from "../../../Types/CustomReq";
import { findUser, generateToken } from "../../Auth/service";
import { changeEmail, createUser, updateUserDetails, changeUsername, getUser, disableAccount, assignUserToTaxi, bookRide } from "../service";

// export const postCreateUser = async (req: Request,res: Response) => {
//     // const authenticatedUser = await findUser()
//     const output = await (createUser({}))
// }

export const postUpdateUser = async (req: CustomReq, res: Response) => {
    const {about, dateOfBirth} = req.body
    const output = await updateUserDetails(req.user?.id!, req.body)
    res.status(200).json(output)
}

export const postChangeEmail = async (req: CustomReq, res: Response) => {
    const output = await changeEmail(req.user?.id!, req.body.email)
    await generateToken(req.body.email);
    res.status(200).json(output)
}

//trying to set up git

export const postChangeUsername = async (req: CustomReq, res: Response) => {
    const output = await changeUsername(req.body.username, req.user?.id!);
    res.status(200).json(output)
}

export const postGetUser = async (req: CustomReq, res: Response) => {
    const output = await getUser({authId: req.user?.id!})
    res.status(200).json(output)
}

export const postDisableAccount = async (req: CustomReq, res: Response) => {
    const output = await disableAccount(req.user?.id!, req.body.password)
    res.status(200).json(output)
}

export const postAssignUserToTaxi = async (req: CustomReq, res: Response) => {
    const output = await assignUserToTaxi(req.user?.id!)
    res.status(200).json(output)
}

export const postOrderRide = async (req: CustomReq, res: Response) => {
    const {from, to} = req.body
    const output = await bookRide(from, to, req.user?.id!)
    res.status(200).json(output)
}