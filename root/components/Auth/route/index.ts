import { Router } from "express";
import validator from "../../../utils/validator";
import { verifyToken } from "../../../utils/verifyToken";
import { joiLoginSchema, joiSchema, joiVerifySchema } from "./Schema";
import { getConfirmPassword, getConfirmSignUp, postLogin, getRefreshToken, postSignUp } from "../controller";
export const authRouter = Router()

authRouter.post('/register', validator(joiSchema), postSignUp)

authRouter.post('/login',validator(joiLoginSchema), postLogin)

authRouter.get('/verify', validator(joiVerifySchema), getConfirmSignUp)

authRouter.get('/refresh', getRefreshToken)

authRouter.get('/confirmPassword', verifyToken, getConfirmPassword)