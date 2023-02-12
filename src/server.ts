import express,{ NextFunction, Request, Response } from 'express';
import http from 'http';
import mongoose, { ConnectOptions } from 'mongoose';
import { config } from './config/config';
import Logging from './library/logging';

const router = express()

mongoose
    .connect(config.mongo.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions)
    .then(() => {
        Logging.info('DB CONNECTED');
        startServer();
    })
    .catch((err) => {
        Logging.error(err);
    });

const startServer = () => {
    // Logging 
    router.use((req: Request, res: Response, next: NextFunction) => {
        // Logging request
        Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            //  Log the response
            Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });

        next();
    });

    // Middleware
    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    // Health check
    router.get('/ping', (req: Request, res: Response, next: NextFunction) => res.status(200).json({ message: 'pong' }));

    // Error handeling checking if route exist
    router.use((req: Request, res: Response, next: NextFunction) => {
        const error = new Error('not found');
        Logging.error(error);
        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port: ${config.server.port}`));
}