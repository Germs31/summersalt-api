"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || "";
const SERVER_PORT = process.env.SERVER_PORT || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
exports.config = {
    mongo: {
        uri: MONGO_URI
    },
    server: {
        port: SERVER_PORT
    },
    session: {
        pwrd: SESSION_SECRET
    }
};
