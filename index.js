import 'dotenv/config';
import './database/connectdb.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import linkRouter from './routes/link.routes.js';
import redirectRouter from './routes/redirect.routes.js';

const app = express();

const whiteList = [process.env.ORIGIN1]

app.use(
    cors({
        origin: function (origin, callback) {
            console.log("Origen: ", origin);
            if (!origin || whiteList.includes(origin)) {
                return callback(null, origin);
            }
            return callback(
                "Error de CORS origin: " + origin + " No autorizado!"
            );
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// ejemplo back redirect (opcional)
app.use('/', redirectRouter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/links', linkRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 http://localhost:${PORT} 🔥`));