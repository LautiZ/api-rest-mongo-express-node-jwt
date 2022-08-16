import { validationResult, body, param } from 'express-validator';
import axios from 'axios';

export const validationResultExpress = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

export const paramLinkValidator = [
    param('id', 'Incorrect format')
        .trim()
        .notEmpty()
        .escape(),
    validationResultExpress

]

export const bodyLinkValidator = [
    body('longLink', 'Icorrect link format')
        .trim()
        .notEmpty()
        .custom(async value => {
            try {
                if (!value.startsWith('https://')) {
                    value = 'https://' + value;
                }

                await axios.get(value);
                return value;
            } catch (error) {
                console.log(error);

                throw new Error('Link not found');
            }
        }),
    validationResultExpress
]

export const bodyRegisterValidator = [
    body('email', 'Incorrect email format')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Minimum 6 characters')
        .trim()
        .isLength({ min: 6 }),
    body('password', 'Incorrect password format')
        .custom((value, { req }) => {
            if (value !== req.body.repassword) {
                throw new Error('Passwords do not match');
            }
            return value;
        }),
    validationResultExpress
];

export const bodyLoginValidator = [
    body('email', 'Incorrect email format')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Minimum 6 characters')
        .trim()
        .isLength({ min: 6 }),
    validationResultExpress
];