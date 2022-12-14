
import { ObjectId } from "mongodb";

export interface IUser {
    username?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    token?: string;
    isVerified?: boolean;
    isActive?: boolean;
    expiresIn?: number;
    about?: string;
    authId?: ObjectId|string|Error;
    dateOfBirth?: Date;
    currentRide?: ObjectId
    role?: string;
    avatar?: string;
    _id?: ObjectId;
    status?: string;
}

export interface IFetchUser {
    _id?: string;
    email?: string;
    phoneNumber?: string;
    token?: string;
    authId?: string
}

export interface JWTpayload {
    id?: string;
    email?: string;
}
