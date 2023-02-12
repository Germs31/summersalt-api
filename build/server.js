"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const logging_1 = __importDefault(require("./library/logging"));
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
    // Health check
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));
    // Error handeling checking if route exist
    router.use((req, res, next) => {
        const error = new Error('not found');
        logging_1.default.error(error);
        return res.status(404).json({ message: error.message });
    });
    http_1.default.createServer(router).listen(config_1.config.server.port, () => logging_1.default.info(`Server is running on port: ${config_1.config.server.port}`));
};
