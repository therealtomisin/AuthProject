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
import { ChangePassword } from "../../../Types/IUser";
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

export const SignUp = async (payload: IAuth, req?: Request): Promise<ObjectId|string> => {
    const checkMail = await findUser({email: payload.email})
    if (checkMail) return "This user already exists!"

    const checkNumber = await findUser({phoneNumber: payload.phoneNumber})
    if (checkNumber) return "This user already exists!"

    const newNumber = intertionalize(payload.phoneNumber!)
    
    const oo = await authModel.create({...payload, phoneNumber: newNumber})
    const token = await generateToken(oo.email!)

    return token
}

export const findUser = async (query: IFetchUser): Promise<IAuth|null> =>{
    const user = await authModel.findOne(query)
    return user
}

export const generateToken = async (email: string): Promise<ObjectId|string> => {
    const userDetails = await findUser({email})
    if (!userDetails) return "There was an error!"

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

export const verifyOTP = async (token: string, id?: string, email?: string) => {
    const user = await findUser({_id: id})
    if(!user) return "no user found!"
    
    if(user.token === null) return "no token found!"
    
    const unhashedToken = await bcrypt.compare(token, user.token!)
    if(!unhashedToken) return "incorrect token!"
    
    const now = Date.now();
    
    if(now >= user.expiresIn!) return "token expired!"

    const updatedUser = await authModel.findOneAndUpdate({_id: id}, {
        $set: {
            token: null,
            isActive: true,
            isVerified: true
        }
    }, {new:true})

    // const output = await login({username: updatedUser?.username, password: updatedUser?.password})

    return updatedUser;
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

export const changePassword = async (id: string, payload: ChangePassword) => {
    const expectedUser = await userModel.findById(id).populate("AuthId")
    
    if(!expectedUser) return "this is not right!"

    const expectedUserAuth = await authModel.findById(expectedUser._id)

    if (payload.currentPassword !== expectedUserAuth?.password) return "you have put in the wrong passord!"

    const changeUserPassword = await authModel.findByIdAndUpdate(expectedUser._id, {
        $set: {
            password: payload.newPassword
        }
    }, {new: true})

    return changeUserPassword

}

export const resetPassword = async (email: string) => {
    const expectedUser = await authModel.findOne({email})
    if (!expectedUser) return "There is no user with this email."

    const token = await generateToken(email)
    return "token has been generated, please input it to confirm password reset!"
}

// export const verifyResetPassword = async (token: string) => {
//     const findAuth = await 
// }


export const deleteAll = async () => {
    const output = await authModel.deleteMany({username: "promix"})
    return output
}

export const confirmPassword = async (id: string, payload: string) => {
    const user = await findUser({authId: id})
    const unhashedPword = bcrypt.compare(payload, user?.password!)

    if(!unhashedPword) return "incorrect password!"


    return "good to go!😉"
}

export const disableAccount = async (id: string) => {
    const output = await authModel.findOneAndUpdate({_id: id}, {
        $set: {
            isActive: false
        }
    }, {
        new: true
    })
    return output
}