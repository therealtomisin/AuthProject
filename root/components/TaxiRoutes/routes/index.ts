import { Router } from "express";
import { verifyToken } from "../../../utils/verifyToken";
import { postCreateRoute } from "../controller";

export const taxiRouteRoutes = Router()

taxiRouteRoutes.post('/new-route', verifyToken, postCreateRoute)