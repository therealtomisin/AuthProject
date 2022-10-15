import { Request, Response } from "express"
import requestCountry from 'request-country'
import geoip from "geoip-country"
import requestIp from 'request-ip'
import { confirmPassword, deleteAll, generateToken, login, resetPassword, SignUp, Token, verifyOTP } from "../service"
import { IAuth } from "../../../Types/IAuth"
import { changeUsername, createUser } from "../../User/service"
import { CustomReq } from "../../../Types/CustomReq"
// import { Token } from "typescript"
// import { CustomReq } from "../../../Types/CustomReq"

export interface CustomRequest extends Request {
    user?: IAuth,
    token?: Token
}

export const postSignUp = async (req: Request, res: Response) => {
try {
    const {username, password, email, phoneNumber, role} = req.body
    const newAuth = await SignUp(req.body)

    console.log("the output of the signup is:", newAuth)

    const output = await createUser({username: username, authId: newAuth, role})

    res.status(200).json(output)

} catch (error: any) {
    console.log(error.message)
}
}

export const postVerifyToken = async (req: Request, res: Response) => {
    try {
        const output = await verifyOTP(req.body.token, req.body._id)
        res.status(200).json(output)
    } catch (error: any) {
        console.log(error.message)
    }
}

export const postLogin = async (req: CustomReq, res: Response) => {
    try {
        const {username, password} = req.body
        const output = await login({username, password})
    
        res.status(200).json(output)
    } catch (error: any) {
        console.log(error.message)
    }
}

export const postDeleteAll = async (req: Request, res: Response) => {
    try {
        const output = await deleteAll()
        res.status(200).send("done")
    } catch (error: any) {
        console.log(error.message)
    }
}

export const postResetPassword = async (req: CustomReq, res: Response) => {
    try {
        const output = await resetPassword(req.body.email)
        res.status(200).json(output)
    } catch (error: any) {
        console.log(error.message)
    }
}

export const postConfirmPassword = async (req: CustomReq, res: Response) => {
   try {
        const output = await confirmPassword(req.user?.id!, req.body.password)
        res.status(200).send("good to go!")
   } catch (error: any) {
        console.log(error.message)
   }
}

export const postDisableAccount = async () => {
    
}