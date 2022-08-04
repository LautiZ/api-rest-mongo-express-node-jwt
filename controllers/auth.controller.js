import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificando que no se repita email buscando por email
        let user = await User.findOne({ email });
        if (user) throw { code: 11000 };

        user = new User({ email, password });
        await user.save();

        // Paso las verificaciones generar jwt
        return res.status(201).json({ message: 'user created' })
    } catch (e) {
        // Errores
        console.log(e);
        // Verificando que no se repita mail por mongoose
        if (e.code === 11000) {
            return res.status(400).json({ error: 'email already registered' });
        }
        return res.status(500).json({ error: 'Error de servidor' });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si existe el mail
        let user = await User.findOne({ email });
        if (!user)
            return res.status(403).json({ error: 'User does not exist' });

        // Verificar si esta correcta la contraseña
        const respuestaPassword = await user.comparePassword(password);
        if (!respuestaPassword)
            return res.status(403).json({ error: 'Incorrect password' });

        // Paso las verificaciones generar jwt
        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ token, expiresIn });
    } catch (e) {
        // Errores
        console.log(e);
        return res.status(500).json({ error: 'Error de servidor' });
    }
}

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid);
        return res.json({ email: user.email, uid: user.id });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

export const refreshToken = (req, res) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie) throw new Error('Token does not exist');

        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        const { token, expiresIn } = generateToken(uid);
        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        const TokenVerificationErrors = {
            'invalid signature': 'Incorrect token',
            'jwt expired': 'Expired token',
            'invalid token': 'Token does not exist',
            'No Bearer': 'Use Bearer format',
            'jwt malformed': 'Token with no valid format'
        };

        return res.status(401).json({ error: TokenVerificationErrors[error.message] });
    }
};

export const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ ok: true });
}