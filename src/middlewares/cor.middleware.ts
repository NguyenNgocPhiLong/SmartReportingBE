import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

export const corMiddleware = cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
});
