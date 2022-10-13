export interface IAuth {
    username?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    token?: string;
    isVerified?: boolean;
    isActive?: boolean;
    expiresIn?: number;
}

export interface IFetchUser {
    _id?: string;
    email?: string;
    phoneNumber?: string;
    token?: string;
    authId?: string
}