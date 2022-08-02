import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: { unique: true },
    },
    password: {
        type: String,
        required: true,
    },
});

// Hashear la contraseña para registrarla en la base de datos
userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password, salt);
        console.log(user.password);
        next()
    } catch (e) {
        console.log(e);
        throw new Error('The password hash failed');
    }
});

// Comparar contraseñas para el login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcryptjs.compare(candidatePassword, this.password);
}

export const User = model('User', userSchema);