import { ChangePassword, IFetchUser, IUser } from "../../../Types/IUser";
import model from "../../Auth/model";
import { confirmPassword, generateToken } from "../../Auth/service";
import userModel from "../model"

export const createUser = async (query?: IUser) => {
    const userCheck = await userModel.findOne({username: query?.username})
    if(userCheck) return "this username is not available!"
    
    const newUser = await userModel.create(query)
    return newUser
}

export const updateUserDetails = async (id: string, payload: IUser) => {
    const output = await userModel.findOneAndUpdate({authId: id}, {
        $set: {
            about: payload.about,
            dateOfBirth: payload.dateOfBirth
        }
    }, {
        new: true
    })

    return output
}

export const changeEmail = async (id: string, email: string) => {
    const checkEmail = await model.findOne({email})
    if (checkEmail) return "user with this email already exits!"

    const updateAuthEmail = await model.findByIdAndUpdate(id, {
        $set: {
            email,
            isVerified: false
        }
    }, {
        new: true
    })

    // await generateToken(email)

    // const updateUserEmail = await userModel.findOneAndUpdate({authId: updateAuthEmail?._id}, {
    //     $set: {
    //         email: updateAuthEmail?.email
    //     }
    // }, {
    //     new: true
    // })

    return updateAuthEmail
}

export const changeUsername = async (username: string, id: string) => {
    const getUser = await userModel.findOne({authId: id})
    
    const checkUsername = await userModel.findOne({username})
    if(checkUsername) return "username is not available!"

    const expectedUser = await userModel.findByIdAndUpdate(getUser?._id, {
        $set: {
            username
        }
    }, {new: true}).populate("authId")

    return expectedUser
}

export const getUser = async (query: IFetchUser) => {
    const output = await userModel.findOne(query).populate("authId")
    return output
}

export const disableAccount = async (id: string, payload: string) => {
    const confPassword = await confirmPassword(id, payload)
    if (confPassword === "incorrect password!") return "cant carry out this operation!"

    const disable = await userModel.findOneAndUpdate({authId: id}, {
        $set: {
            isActive: false
        }
    }, {
        new: true
    })

    return disable
}

