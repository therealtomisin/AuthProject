import { IRides } from "../../../Types/IRides";
import { ITaxi } from "../../../Types/ITaxi";
import { IFetchUser, IUser } from "../../../Types/IUser";
import model from "../../Auth/model";
import { confirmPassword, generateAuthToken } from "../../Auth/service";
import rideModel from "../../Rides/model";
import { createRide } from "../../Rides/service";
import routeModel from "../../TaxiRoutes/model";
import { taxiModel } from "../../Taxis/model";
import userModel from "../model"

export const createUser = async (query?: IUser): Promise<Error|IUser> => {
    const userCheck = await userModel.findOne({username: query?.username})
    if(userCheck) return new Error("this username is not available!")
    
    const newUser = await userModel.create(query)
    return newUser as IUser
}

export const updateUserDetails = async (id: string, payload: IUser): Promise<IUser|Error> => {
   try {
    console.log(payload.avatar)
    const output = await userModel.findOneAndUpdate({authId: id}, {
        $set: {
            about: payload.about,
            dateOfBirth: payload.dateOfBirth,
            avatar: payload.avatar
        }
    }, {
        new: true
    })

    return output as IUser
   } catch (error: any) {
    console.log(error.message)
    return new Error(error.message)
   }
}

export const changeEmail = async (id: string, email: string) => {
    const checkEmail = await model.findOne({email})
    if (checkEmail) return new Error("user with this email already exits!")

    const updateAuthEmail = await model.findByIdAndUpdate(id, {
        $set: {
            email,
            isVerified: false
        }
    }, {
        new: true
    })

    return updateAuthEmail
}

export const changeUsername = async (username: string, id: string) => {
    const getUser = await userModel.findOne({authId: id})
    
    const checkUsername = await userModel.findOne({username})
    if(checkUsername) return new Error("username is not available!")

    const expectedUser = await userModel.findByIdAndUpdate(getUser?._id, {
        $set: {
            username
        }
    }, {new: true}).populate("authId")

    return expectedUser
}

export const getUser = async (query: IFetchUser): Promise<IUser|null> => {
    const output = await userModel.findOne(query).populate("authId")
    return output as IUser
}

export const disableAccount = async (id: string, payload: string) => {
    const confPassword = await confirmPassword(id, payload)
    if (confPassword === "incorrect password!") return new Error("cant carry out this operation!")

    const disable = await userModel.findOneAndUpdate({authId: id}, {
        $set: {
            isActive: false
        }
    }, {
        new: true
    })

    return disable
}

export const activateAccount = async (id: string) => {
    const user = await getUser({authId: id})
    if (!user) throw new Error("user does not exist!")

    await userModel.findByIdAndUpdate(id, {
        $set: {
            isActive: true
        }
    }, {
        new: true
    })
}

export const assignUserToTaxi = async (id: string): Promise<null|ITaxi|string|Error> => {
    const check = await model.findOne({_id: id})
    if(check?.role === "passenger") return new Error("there must be an issue somewhere.")

    const user = await userModel.findOne({authId: id})
    if(!user) return new Error("oopsie!")

    const userId = user._id

    const getTaxis = await taxiModel.find()
    const taxiIds = getTaxis.map(taxi=>{
        return taxi._id
    })
    let x = taxiIds.length
    const getTaxi = Math.trunc(Math.random()*x);

    const currentTaxi = await taxiModel.findOneAndUpdate({_id: taxiIds[getTaxi]}, {
        $set: {
            currentDriver: userId
        }
    }, {new: true})

    return currentTaxi

}

export const bookRide = async (from: string, to: string, authId: string) => {

    const getCurrentUser = await getUser({authId})
    if(!getCurrentUser) return new Error("oops, there is a problem!")

    if(getCurrentUser.role === "driver") return new Error("nigga you should be driving!")

    const getRoute = await routeModel.findOne({from, to})
    if(!getRoute) return new Error("sorry, we don't follow this route.")

    const getRouteTaxis = await taxiModel.find({route: getRoute._id, status: 'free'})
    const getTaxiIds = getRouteTaxis.map(routeTaxi => {
        return routeTaxi._id
    })

    let taxiIdLength = getTaxiIds.length
    let getRandomNum = Math.trunc(Math.random()*taxiIdLength)

    const getRandomTaxiId = getTaxiIds[getRandomNum]

    const taxiCred = await taxiModel.findOne({_id: getRandomTaxiId})
    if(!taxiCred) return new Error("Sorry there are no active riders at the moment.")
    if(parseInt(taxiCred?.seatsTaken!) >= parseInt(taxiCred?.capacity!)) throw new Error ("this taxi is full, sorry.")

    const newRide = await createRide({
        passengers: [],
        assignedRider: taxiCred.currentDriver,
        routeId: taxiCred.route,
        status: "yetToStart"
    })

    const updateRide = await rideModel.findOneAndUpdate(newRide._id, {
        $push: {
            passengers: getCurrentUser._id
        }
    })

    const updateUserRide = await userModel.findByIdAndUpdate(getCurrentUser._id, {
        $set: {
            currentRide: newRide._id
        }
    }, {new: true})

    const updateTaxiStatus = await taxiModel.findByIdAndUpdate(getRandomTaxiId, {
        $set: {
            seatsTaken: (parseInt(taxiCred.seatsTaken!) + 1).toString()
        }
    }, {new: true})

    return {
        newRide,
        updateUserRide,
        updateTaxiStatus
    }

}

export const passengerJoinTrip = async () => {
    
}

export const driverStartTrip = async (authId: string) => {
    const driver = await getUser({authId})
    if(driver?.role !== "driver") throw new Error("you can't do this!")

    const getActiveRide = await rideModel.findOne({assignedRider: driver?._id, status: "yetToStart"})
    if (!getActiveRide) throw new Error("you can't start this trip.")

    const noOfPassengers = await userModel.find({currentRide: getActiveRide._id}).count()

    const updateRide = await rideModel.findByIdAndUpdate(getActiveRide._id, {
        $set: {
            status: 'inProgress',
            passengers: noOfPassengers
        }
    }, {new: true})
}

export const driverEndTrip = async (authId: string) => {
    const driver = await getUser({authId})
    const findRide = await rideModel.findOneAndUpdate({assignedRider: driver?._id, status: "in progress"}, {
        $set: {
            status: "ended"
        }
    }, {new: true})

    const changeTaxiStatus = await taxiModel.findOneAndUpdate()

    return findRide

}

export const passengerCancelRideBooking = async (authId: string) => {
    const user = await getUser({authId})
    if(!user) throw new Error("you were not booked in the first place, how do you intend to cancel ?")

    const updateRideUser = await userModel.findByIdAndUpdate(user?._id, {
        $set: {
            currentRide: null
        }
    }, {new: true})

    const currentRide = await rideModel.findOne({passengers: user._id})

    const passengers = currentRide?.passengers

    const updateRide = await rideModel.findOneAndUpdate({passengers: user._id}, {
        $set: {
            passengers: null,
            status: "notBusy"
        }
    })
}

export const adminDisableOrEnableDriver = async (_id: string): Promise<Error|IRides> => {
    const checkDriverStatus = await getUser({_id})

    if (!checkDriverStatus?.isVerified) throw new Error("driver was not verified in the first place.")

    return await userModel.findByIdAndUpdate(checkDriverStatus?._id, {
        $set: {
            status: checkDriverStatus?.status === "enabled" ? "disabled" : "enabled"
        }
    }, {new: true}) as IRides

    // if(checkDriverStatus.status === "enabled") return "driver has been enabled!"

    // if(checkDriverStatus.status === "disabled") return "driver has been disabled!"
}

// export const shareRide = () => {

// }

export const passengerRateRide = async (id: string, value: string): Promise<IRides> => {
    const rateRide = await rideModel.findByIdAndUpdate(id, {
        $set: {
            rating: value
        }
    }, {new: true})

    return rateRide as IRides
}

export const getAllDriverRides = async (payload: IUser): Promise<IRides[]> => {
    const allRidesByDriver = await rideModel.find({assignedRider: payload._id}) 

    return allRidesByDriver
}



