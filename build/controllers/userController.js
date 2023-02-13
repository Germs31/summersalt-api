"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = bcryptjs_1.default.hashSync(password, bcryptjs_1.default.genSaltSync(10));
        const createUser = yield User_1.default.create({ username, password: hashedPassword, email });
        res.status(201).json({ data: createUser });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const foundUser = yield User_1.default.findOne({ username: req.body.username });
        if (foundUser) {
            if (bcryptjs_1.default.compareSync(req.body.password, foundUser.password)) {
                req.session.userId = foundUser._id;
                req.session.username = foundUser.username;
                req.session.logged = true;
                res.status(200).json({ data: foundUser, message: 'Login successful' });
            }
            else {
                res.status(401).json({ message: "Username or password is incorrect" });
            }
        }
        else {
            res.status(401).json({ message: "Username or password is incorrect" });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy((error) => {
            if (error) {
                return res.status(500).json({ message: "There has been am error logging out" });
            }
            // res.clearCookie('connect.sid')
            res.status(200).json({ message: "Log out has been successful" });
            console.log(req.session);
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.logoutUser = logoutUser;
