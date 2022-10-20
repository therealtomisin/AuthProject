import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import model from '../components/Auth/model';
import { CustomReq } from '../Types/CustomReq';
import { IUser, JWTpayload } from '../Types/IUser';

export const verifyToken = (req: CustomReq, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log("there is no valid token!")
    if (!token) return new Error("There is no valid token!");

    jwt.verify(token, String(process.env.SECRET), (err, user)=>{
        if (err) {
            console.log("you are not authenticated")
            return new Error("you are not authenticated!")
        };

        console.log("Verified!")
        req.user = user as JWTpayload

        next()
    })
}

export const verifyTokenAndAdmin = async (req: CustomReq, res: Response, next: NextFunction) => {
    verifyToken(req, res, next)

    const checkIfAdmin = await model.findById(req.user?.id)

    if(checkIfAdmin?.role === 'Admin') {
        next()
    }    
}

export const verifyTokenAndDriver = async (req: CustomReq, res: Response, next: NextFunction) => {
    verifyToken(req, res, next)

    const checkIfDriver = await model.findById(req.user?.id)

    if(checkIfDriver?.role === 'driver') {
        next()
    }    
}