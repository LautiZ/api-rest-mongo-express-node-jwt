import jwt from 'jsonwebtoken';

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

        const TokenVerificationErrors = {
            'invalid signature': 'Incorrect token',
            'jwt expired': 'Expired token',
            'invalid token': 'Token does not exist',
            'No Bearer': 'Use Bearer format',
            'jwt malformed': 'Token with no valid format'
        };

        return res.status(401).json({ error: TokenVerificationErrors[error.message] });
    }
}