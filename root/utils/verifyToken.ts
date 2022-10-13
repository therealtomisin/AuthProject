import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { CustomReq } from '../Types/CustomReq';
import { IUser, JWTpayload } from '../Types/IUser';

export const verifyToken = (req: CustomReq, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return "There is no valid token!";

    jwt.verify(token, String(process.env.SECRET), (err, user)=>{
        if (err) {
            return "You are not authenticated!";
        };

        console.log("Verified!")
        req.user = user as JWTpayload

        next()
    })
}