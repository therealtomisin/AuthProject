import mongoose from "mongoose";

export const db = async () => {
    try {
        await mongoose.connect(String(process.env.MONGODB_URI))
        console.log('database connected succesfully!')
    } catch (error: any) {
        console.log(error.message)
    }
}