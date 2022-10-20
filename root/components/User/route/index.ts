import { Router } from "express";
import { verifyToken } from "../../../utils/verifyToken";
import { postAssignUserToTaxi, postChangeEmail, postChangeUsername, postDisableAccount, postGetUser, postOrderRide } from "../../User/controller";
import { postUpdateUser } from "../controller";
import { changeUsername } from "../service";
import { upload } from "../../../utils/multer";
export const userRouter = Router()

userRouter.post('/changeUsername', verifyToken, postChangeUsername)

userRouter.post('/updateUser', verifyToken, upload.single('avatar'), postUpdateUser)

userRouter.post('/changeEmail', verifyToken, postChangeEmail)

userRouter.get('/getUser', verifyToken, postGetUser)

userRouter.post('/disableUser', verifyToken, postDisableAccount)

userRouter.post('/assign', verifyToken, postAssignUserToTaxi)

userRouter.post('/order-ride', verifyToken, postOrderRide)