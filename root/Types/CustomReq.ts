import { Request } from "express";
import { IUser, JWTpayload } from "./IUser";

export interface CustomReq extends Request{
    user?: JWTpayload;
    token?: string;
}