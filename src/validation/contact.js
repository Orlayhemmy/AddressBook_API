import { check } from 'express-validator'
import Contact from '../entities/contact'

const contactValidation = {
    create: [
        check('fullname')
            .trim()
            .not()
            .isEmpty()
            .withMessage('fullname cannot be empty')
            .isLength({ max: 256 })
            .withMessage('must not be longer than 256')
            .custom(async (fullname, { req: { user } }) => {
                const existingNumber = await Contact.findOne({
                    fullname,
                    userId: user.id
                })
                if (existingNumber) throw new Error('Contact with that name exists!')
            }),
        check('number')
            .trim()
            .not()
            .isEmpty()
            .withMessage('number cannot be empty')
            .bail()
            .isLength({ max: 20 })
            .withMessage('must be lesser than 20 digits')
            .matches(/^[0-9+-\s]+$/)
            .withMessage('Letters are not allowed!')
            .custom(async (number, { req: { user } }) => {
                const existingNumber = await Contact.findOne({
                    number,
                    userId: user.id
                })
                if (existingNumber) throw new Error('Contact with that number exists!')
            }),
        check('address')
            .trim()
            .isLength({ max: 256 })
            .withMessage('must not be longer than 256')
    ],
    update: [
        check('fullname')
            .trim()
            .isLength({ max: 256 })
            .withMessage('must not be longer than 256')
            .custom(async (fullname, { req: { user } }) => {
                const existingNumber = await Contact.findOne({
                    fullname,
                    userId: user.id
                })
                if (existingNumber) throw new Error('Contact with that name exists!')
            }),
        check('number')
            .trim()
            .isLength({ max: 20 })
            .withMessage('must be lesser than 20 digits')
            .custom(async (number, { req: { user } }) => {
                const existingNumber = await Contact.findOne({
                    number,
                    userId: user.id
                })
                if (existingNumber) throw new Error('Contact with that number exists!')
            }),
        check('address')
            .trim()
            .isLength({ max: 256 })
            .withMessage('must not be longer than 256')
    ]
}

export default contactValidation
