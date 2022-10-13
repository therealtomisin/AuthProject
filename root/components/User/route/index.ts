import { Router } from "express";
import { verifyToken } from "../../../utils/verifyToken";
import { postChangeEmail, postChangeUsername, postDisableAccount, postGetUser } from "../../User/controller";
import { postUpdateUser } from "../controller";
import { changeUsername } from "../service";
export const userRouter = Router()

userRouter.post('/changeUsername', verifyToken, postChangeUsername)

userRouter.post('/updateUser', verifyToken, postUpdateUser)

userRouter.post('/changeEmail', verifyToken, postChangeEmail)

userRouter.get('/getUser', verifyToken, postGetUser)

userRouter.post('/disableUser', verifyToken, postDisableAccount)