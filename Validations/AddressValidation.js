import Joi from 'joi'
import validateRequest from './validate.js';

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPassswordError = 'Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length';

export const post = (req, res, next) => {
    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().trim()
            .lowercase().messages({
                'string.email': 'Email must be a valid email',
                'string.empty': 'Email cannot be an empty field',
                'any.required': 'Email is a required field',
            }),
        firstName: Joi.string().required().max(20).min(3).trim(),
        lastName: Joi.string().required().max(20).min(3).trim(),
        companyName: Joi.string().trim().allow('').optional(),
        country: Joi.string().required().trim(),
        address: Joi.string().required().trim(),
        appartment: Joi.string().trim().allow('').optional(),
        town: Joi.string().required().trim(),
        state: Joi.string().required().trim(),
        phoneNumber: Joi.string().required().trim(),
        user: Joi.string().required().trim()
    });
    validateRequest(req, next, schema)
} 