"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const signUp = async (req, res, next) => {
    try {
        const { email, password, username, firstName, lastName } = req.body;
        const existingUser = user_model_1.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const fullName = `${firstName || ''} ${lastName || ''}`.trim();
        const newUser = {
            id: user_model_1.users.length + 1,
            email,
            password: hashedPassword,
            username,
            firstName,
            lastName,
            fullName,
        };
        user_model_1.users.push(newUser);
        return res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.signUp = signUp;
const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = user_model_1.users.find(u => u.email === email);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword)
            return res.status(401).json({ message: 'Invalid password' });
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
        }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    catch (error) {
        next(error);
    }
};
exports.signIn = signIn;
