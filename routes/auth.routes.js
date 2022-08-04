import { Router } from 'express';
import { infoUser, login, register, refreshToken, logout } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import { validationResultExpress } from '../middlewares/validationResultExpress.js';
import { requireToken } from '../middlewares/requireToken.js';

const router = Router();

router.post('/register',
    [
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
            })
    ],
    validationResultExpress,
    register);

router.post('/login',
    [
        body('email', 'Incorrect email format')
            .trim()
            .isEmail()
            .normalizeEmail(),
        body('password', 'Minimum 6 characters')
            .trim()
            .isLength({ min: 6 }),
    ],
    validationResultExpress,
    login);

router.get('/protected', requireToken, infoUser);
router.get('/refresh', refreshToken);
router.get('/logout', logout);

export default router; 