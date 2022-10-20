import { Request, Response } from "express"
import requestCountry from 'request-country'
import geoip from "geoip-country"
import requestIp from 'request-ip'
import { changePassword, confirmPassword, generateAuthToken, login, resetPassword, SignUp, Token, verifyOTP } from "../service"
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

export const postRefreshToken = async (req: CustomReq, res: Response) => {
    generateAuthToken(req.body.email)

    res.status(200).send('the token has been generated again!')
}

export const postVerifyToken = async (req: Request, res: Response) => {
    try {
        const {email, id} = req.body
        const output = await verifyOTP({id, email})
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

export const postResetPassword = async (req: CustomReq, res: Response) => {
    try {
        const output = await resetPassword(req.body.email)
        res.status(200).json(output)
    } catch (error: any) {
        console.log(error.message)
    }
}

export const getConfirmResetPassword = async (req: CustomReq, res: Response) => {
    const {token, email} = req.body
    const output = verifyOTP({token, email})

    res.status(200).json(output)
}

export const postConfirmPassword = async (req: CustomReq, res: Response) => {
   try {
        const output = await confirmPassword(req.user?.id!, req.body.password)
        res.status(200).send("good to go!")
   } catch (error: any) {
        console.log(error.message)
   }
}

export const postChangePassword = async (req: CustomReq, res: Response) => {
    try {
        const {currentPassword, newPassword, confirmPassword} = req.body
        const output = await changePassword(req.user?.id!, {currentPassword, newPassword, confirmPassword})

        res.status(200).json(output)
        
    } catch (error: any) {
        console.log(error.message)
    }
}