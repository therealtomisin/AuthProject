import express from 'express'
import dotenv from 'dotenv'
import {db} from './database/mydb'
import { authRouter } from './components/Auth/route'
import requestCountry from 'request-country'
import { CustomReq } from './Types/CustomReq'
import { userRouter } from './components/User/route'

dotenv.config()
const port = Number(process.env.PORT) || 5005
const app = express()
app.use(express.json())
app.set('trust proxy', true)
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, () => {
    try {
        db()
        console.log('server is running on port:::', port)
    } catch (error: any) {
        console.log('we have an issue!')
    }
})