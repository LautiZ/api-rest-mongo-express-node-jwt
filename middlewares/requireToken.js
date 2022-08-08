import jwt from 'jsonwebtoken';
import { tokenVerificationErrors } from '../utils/tokenManager.js';

export const requireToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;

        if (!token) throw new Error('Token does not exist, use bearer');

        token = token.split(' ')[1];

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;

        next();
    } catch (error) {
        console.log(error.message);

        return res.status(401).json({ error: tokenVerificationErrors[error.message] });
    }
}