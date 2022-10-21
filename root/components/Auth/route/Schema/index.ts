import Joi from 'joi'

const phoneNumber = Joi.string()
.required()
.min(11)
.pattern(/^\+?(\(\d{3}\))?[ -]?\d{3,4}[ -]?\d{3}?[ -]?\d{4}$/)
.messages({
    'string.required' : 'this is a required field!'
})

const email = Joi.string().email().required().messages({
    'email.string': "the email must be a string!",
    'email.required': 'the email is required!'
})

const password = Joi.string().min(6).required().pattern(/[a-zA-Z\W\d]+/).messages({
    'password.string': 'password is a string!',
    'password.required': "password is a required field!",
    'password.min': 'you have put past the allowed number of characters'
})

const username =  Joi.string().min(5).max(15).required()

const role = Joi.string().required()

const token = Joi.string().required().min(4).max(4).pattern(/^\d{4}$/)

export const joiSchema = Joi.object().keys({
    phoneNumber,
    email,
    password,
    username,
    role
})

export const joiVerifySchema = Joi.object().keys({
    token,
    email
})

export const joiLoginSchema = Joi.object().keys({
    username,
    password
})