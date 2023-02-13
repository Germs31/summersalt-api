import express,{ NextFunction, Request, Response } from 'express';
import http from 'http';
import session from 'express-session'
import mongoose, { ConnectOptions } from 'mongoose';
import { config } from './config/config';
import Logging from './library/logging';
import userRoute from './routes/userRoute'

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
    router.use(session({
        secret: config.session.pwrd, // Use a secret key to sign the session ID cookie
        resave: false,
        saveUninitialized: true,
        // store: new MongoStore({
        //     url: 'mongodb://localhost/session-store'
        // }),
        cookie: {
          secure: false, // Set to true for secure (HTTPS) connections
          maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
      }));


    // Access policy
    router.use(function (req: Request, res: Response, next: NextFunction) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requesterd-With, Content-Type, Accept , Authorization');
        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            return res.status(200).json({});
        }
        next();
    });

    // Health check
    router.get('/ping', (req: Request, res: Response, next: NextFunction) => res.status(200).json({ message: 'pong' }));

    // Routes
    router.use('/api/user', userRoute)

    // Error handeling checking if route exist
    router.use((req: Request, res: Response, next: NextFunction) => {
        const error = new Error('not found');
        Logging.error(error);
        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port: ${config.server.port}`));
}