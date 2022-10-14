import { ChangePassword, IFetchUser, IUser } from "../../../Types/IUser";
import model from "../../Auth/model";
import { confirmPassword, generateToken } from "../../Auth/service";
import routeModel from "../../TaxiRoutes/model";
import { taxiModel } from "../../Taxis/model";
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

export const assignUserToTaxi = async (id: string) => {
    const check = await model.findOne({_id: id})
    if(check?.role === "passenger") return "there must be an issue somewhere."

    const user = await userModel.findOne({authId: id})
    if(!user) return "oopsie!"

    const userId = user._id

    const getTaxis = await taxiModel.find()
    const taxiIds = getTaxis.map(taxi=>{
        return taxi._id
    })
    let x = taxiIds.length
    const getTaxi = Math.trunc(Math.random()*x) + 1;

    const currentTaxi = await taxiModel.findOneAndUpdate({_id: taxiIds[getTaxi]}, {
        $set: {
            currentDriver: userId
        }
    }, {new: true})

    return currentTaxi

}

export const bookRide = async (from: string, to: string) => {
    const getRoute = await routeModel.findOne({from, to})
    if(!getRoute) return "sorry, we don't follow this route."

    const getRouteTaxis = taxiModel.find({route: getRoute._id})

    
}

