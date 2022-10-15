import { Router } from "express";
import { verifyToken } from "../../../utils/verifyToken";
import { postAddTaxi } from "../controller";

export const taxiRoutes = Router()

taxiRoutes.post('/new-taxi', verifyToken, postAddTaxi)