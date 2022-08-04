import 'dotenv/config';
import './database/connectdb.js';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 http://localhost:${PORT} 🔥`));