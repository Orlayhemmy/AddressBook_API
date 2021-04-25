import {
    check
} from 'express-validator'
import User from '../entities/user'

const userValidation = {
    signup: [
        check('name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('name cannot be empty')
            .isLength({
                max: 256
            })
            .withMessage('must not be longer than 256'),
        check('username')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Username cannot be empty')
            .bail()
            .isLength({ max: 256 })
            .withMessage('must not be longer than 256')
            .custom(async (username) => {
                const existingUser = await User.findOne({
                    username
                })
                if (existingUser) throw new Error('Username already in use')
            }),
        check('email')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Email cannot be empty')
            .bail()
            .isEmail()
            .withMessage('email must be a valid email')
            .isLength({ max: 256 })
            .withMessage('must not be longer than 256')
            .custom(async (email) => {
                const existingUser = await User.findOne({
                    email
                })
                if (existingUser) throw new Error('Email already in use')
            }),
        check('password')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Password cannot be empty')
            .bail()
            .matches(/^[a-zA-Z0-9\s]+$/)
            .withMessage('Password should only be alphanumeric')
            .bail()
            .isLength({ min: 8, max: 256 })
            .withMessage('Password must not be less than 8 characters')
    ],
    login: [
        check('email')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Email cannot be empty')
            .if(check('email').exists({ checkFalsy: true }))
            .isEmail()
            .withMessage('email must be a valid email')
            .isLength({ max: 256 })
            .withMessage('must not be longer than 256'),
        check('password')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Password cannot be empty')
            .bail()
            .isLength({ min: 8, max: 256 })
            .withMessage('Password must not be less than 8 characters')
    ],
    forgotPassword: [
        check('email')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Email cannot be empty')
            .bail()
            .isEmail()
            .withMessage('email must be a valid email')
            .isLength({ max: 256 })
            .withMessage('must not be longer than 256')
    ],
    resetPassword: [
        check('password')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Password cannot be empty')
            .bail()
            .matches(/^[a-zA-Z0-9\s]+$/)
            .withMessage('Password should only be alphanumeric')
            .bail()
            .isLength({ min: 8, max: 256 })
            .withMessage('Password must not be less than 8 characters')
    ]
}

export default userValidation
