import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './src/configs/db.config';
import logger from './src/utils/loggers.utils';

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Import CORS middleware
import { corMiddleware } from './src/middlewares/cor.middleware';
app.use(corMiddleware);

// Import routes
import resourceRoutes from './src/routes/resource.route';
import projectRoutes from './src/routes/project.route';

// Global database initialization function
global.initDB = async (): Promise<void> => {
    if (mongoose.connection.readyState === 0) {
        await connectDB();
    }
};

// Use routes
app.use('/resources', resourceRoutes);
app.use('/projects', projectRoutes);

// Import 404 and error handling middleware
import { notFoundMiddleware } from './src/middlewares/error404.middleware';
import { errorMiddleware } from './src/middlewares/error.middleware';

// Use 404 middleware
app.use(notFoundMiddleware);

// Use error middleware
app.use(errorMiddleware);

// Get port from environment variables
const port = process.env.PORT;

// Start server
app.listen(port, () => {
    logger.info(`Server running at port ${port}`);
});
