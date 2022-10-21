import { IAuth, IFetchUser } from "../../../Types/IAuth"
import authModel from "../model"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import requestCountry from 'request-country';
import { CustomReq } from "../../../Types/CustomReq";
import { Request, Response } from "express";
import { CustomRequest } from "../controller";
import { intertionalize } from "../../../utils/utils";
import userModel from "../../User/model";
import { ChangePassword } from "../../../Types/IAuth";
import { ObjectId } from "mongodb";
import Mailgun from "mailgun-js";
import { sendEmail } from "../../../utils/mailgun";

export interface Token {
    smsNumber?: string;
    token?: string
}

export interface SignUpOutPut  {
    newUser?: IAuth;
    token?: string;
}

export const SignUp = async (payload: IAuth): Promise<ObjectId|string|Error> => {
    const checkMail = await findUser({email: payload.email})
    if (checkMail) return new Error("This user already exists!")

    const checkNumber = await findUser({phoneNumber: payload.phoneNumber})
    if (checkNumber) return new Error("This user already exists!")

    // const newNumber = intertionalize(payload.phoneNumber!)
    
    const oo = await authModel.create(payload)
    const token = await generateAuthToken(oo.email!)

    return token
}

export const confirmSignUp2 = async (payload: IAuth) => {
    const findMatchingUser = await authModel.findOne({payload})
    if(!findMatchingUser) throw new Error("incorrect token.")

    const compareToken = await bcrypt.compare(payload.token!, findMatchingUser?.token!)
    if(!compareToken) throw new Error("incorrect!")

    const now = Date.now()
    if(findMatchingUser?.expiresIn! <= now) throw new Error("token is expired!")


}

export const findUser = async (query: IFetchUser): Promise<IAuth|null> =>{
    const user = await authModel.findOne(query)
    return user
}

export const generateAuthToken = async (email: string): Promise<ObjectId|string|Error> => {
    const userDetails = await findUser({email})
    if (!userDetails) return new Error("There was an error!")

    const token = Math.floor(1000 + Math.random() * 9000).toString()
    console.log('the token is: ', token)
    const hashedToken = await bcrypt.hash(token, 10)

    const now = Date.now();
    const expire = now + 120000;

    const updatedAuth =  await authModel.findOneAndUpdate({email}, {
        $set: {
            token: hashedToken,
            expiresIn: expire
        }
    }, {new: true})

    sendEmail(email, token)

    return updatedAuth!._id
}

export const verifyOTP = async (payload: IAuth): Promise<Error|IAuth> => {
    const user = await findUser(payload)
    if(!user) throw new Error("no user found!")
    
    if(user.token === null) throw new Error("no token found!")
    
    const unhashedToken = await bcrypt.compare(payload?.token!, user.token!)
    if(!unhashedToken) throw new Error("incorrect token!")
    
    const now = Date.now();
    
    if(now >= user.expiresIn!) throw new Error("token expired!")

    const updatedUser = await authModel.findOneAndUpdate(payload, {
        $set: {
            token: null,
            isActive: true,
            isVerified: true
        }
    }, {new:true})

    return updatedUser as IAuth
}


export const login = async (payload: IAuth): Promise<Record<string, string>|string|null> => {
    const activeUser = await authModel.findOne({username: payload.username})
    if (!activeUser) return "incorrect credentials!"

    const unhashedPassword = await bcrypt.compare(payload.password!, activeUser.password!)
    if(!unhashedPassword) return "incorrect credentials!"

    const token = jwt.sign({id: activeUser._id, email: activeUser.email}, String(process.env.SECRET), {expiresIn: '1d'})    
    return {
        username: activeUser.username as string,
        email: activeUser.email as string,
        token
    }
}

export const changePassword = async (id: string, payload: ChangePassword): Promise<Error|IAuth> => {

    const expectedUserAuth = await authModel.findById(id)

    const unhashedPassword = bcrypt.compare(payload.currentPassword, expectedUserAuth?.password!)

    if (!unhashedPassword) throw new Error("you have put in the wrong password!")

    const changeUserPassword = await authModel.findByIdAndUpdate(id, {
        $set: {
            password: payload.newPassword
        }
    }, {new: true})

    return changeUserPassword as IAuth

}

export const resetPassword = async (email: string): Promise<string|Error> => {
    const expectedUser = await authModel.findOne({email})
    if (!expectedUser) throw new Error("There is no user with this email.")

    await generateAuthToken(email)

    return "token has been generated, please input it to confirm password reset!"
}

export const confirmPassword = async (id: string, payload: string) => {
    const user = await findUser({authId: id})
    const unhashedPword = bcrypt.compare(payload, user?.password!)

    if(!unhashedPword) throw new Error("incorrect password!")


    return "good to go!😉"
}

export const completeResetPassword = async (newPassword: string, id: string) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const updatePassword = await authModel.findOneAndUpdate({id}, {
        $set: {
            password: hashedPassword
        }
    }, {new: true})

    return updatePassword
}

export const disableAccount = async (id: string) => {
    const output = await authModel.findOneAndUpdate({_id: id}, {
        $set: {
            isActive: false,
        }
    }, {
        new: true
    })
    return output
}