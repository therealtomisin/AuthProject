import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

export default (schema: Joi.ObjectSchema) => 
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const { error } = schema.validate(req.body)
            if(!error) return next()

            const {details} = error

            console.log(details)
            res.send(details)
        } catch (error: any) {
            return error.message
        }
}