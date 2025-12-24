"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = __importDefault(require("../models"));
const AppError_1 = require("../utils/AppError");
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, (process.env.JWT_SECRET || 'secret'), {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1d'),
    });
};
const signup = async (data) => {
    const existingUser = await models_1.default.User.findOne({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new AppError_1.AppError('Email already in use', 400);
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
    const newUser = await models_1.default.User.create({
        name: data.name,
        email: data.email,
        password_hash: hashedPassword,
        role: data.role || 'USER',
    });
    const token = signToken(newUser.id);
    return { user: newUser, token };
};
exports.signup = signup;
const login = async (data) => {
    const user = await models_1.default.User.findOne({ where: { email: data.email } });
    if (!user || !(await bcryptjs_1.default.compare(data.password, user.password_hash))) {
        throw new AppError_1.AppError('Incorrect email or password', 401);
    }
    const token = signToken(user.id);
    return { user, token };
};
exports.login = login;
//# sourceMappingURL=auth.service.js.map