import { Router } from "express";
import { verifyToken } from "../../../utils/verifyToken";
import { postConfirmPassword, postDeleteAll, postLogin, postSignUp, postVerifyToken } from "../controller";
export const authRouter = Router()

authRouter.post('/register', postSignUp)

authRouter.post('/login', postLogin)

authRouter.post('/verify', postVerifyToken)

authRouter.delete('/delete', postDeleteAll)

authRouter.post('/confirmPassword', verifyToken, postConfirmPassword)