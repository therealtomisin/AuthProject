
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
    authId?: ObjectId|string;
    dateOfBirth?: Date;
    currentRide?: ObjectId
    role?: string
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

export interface ChangePassword {
    currentPassword: string;
    newPassword: string;
    consfirmPassword: string;
}