export interface IAuth {
    username?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    token?: string;
    isVerified?: boolean;
    isActive?: boolean;
    expiresIn?: number;
    role?: string
}

export interface IFetchUser {
    _id?: string;
    email?: string;
    phoneNumber?: string;
    token?: string;
    authId?: string
}