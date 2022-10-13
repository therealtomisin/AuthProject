import mongoose from "mongoose";

export const db = async () => {
    try {
        await mongoose.connect('mongodb+srv://redrixx:redrixx12345@cluster0.ykjtuzy.mongodb.net/?retryWrites=true&w=majority')
        console.log('database connected succesfully!')
    } catch (error: any) {
        console.log(error.message)
    }
}