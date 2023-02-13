"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const logging_1 = __importDefault(require("./library/logging"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const router = (0, express_1.default)();
mongoose_1.default
    .connect(config_1.config.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    logging_1.default.info('DB CONNECTED');
    startServer();
})
    .catch((err) => {
    logging_1.default.error(err);
});
const startServer = () => {
    // Logging 
    router.use((req, res, next) => {
        // Logging request
        logging_1.default.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            //  Log the response
            logging_1.default.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });
        next();
    });
    // Middleware
    router.use(express_1.default.urlencoded({ extended: true }));
    router.use(express_1.default.json());
    router.use((0, express_session_1.default)({
        secret: config_1.config.session.pwrd,
        resave: false,
        saveUninitialized: true,
        // store: new MongoStore({
        //     url: 'mongodb://localhost/session-store'
        // }),
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    }));
    // Access policy
    router.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requesterd-With, Content-Type, Accept , Authorization');
        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            return res.status(200).json({});
        }
        next();
    });
    // Health check
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));
    // Routes
    router.use('/api/user', userRoute_1.default);
    // Error handeling checking if route exist
    router.use((req, res, next) => {
        const error = new Error('not found');
        logging_1.default.error(error);
        return res.status(404).json({ message: error.message });
    });
    http_1.default.createServer(router).listen(config_1.config.server.port, () => logging_1.default.info(`Server is running on port: ${config_1.config.server.port}`));
};
