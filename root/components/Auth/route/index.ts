import { Router } from "express";
import { verifyToken } from "../../../utils/verifyToken";
import { postConfirmPassword, postLogin, postRefreshToken, postSignUp, postVerifyToken } from "../controller";
export const authRouter = Router()

authRouter.post('/register', postSignUp)

authRouter.post('/login', postLogin)

authRouter.post('/verify', postVerifyToken)

authRouter.post('/refresh', postRefreshToken)

authRouter.post('/confirmPassword', verifyToken, postConfirmPassword)