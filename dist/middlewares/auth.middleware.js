"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError");
const models_1 = __importDefault(require("../models"));
const authenticate = async (req, _res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError_1.AppError('You are not logged in! Please log in to get access.', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        const currentUser = await models_1.default.User.findByPk(decoded.id);
        if (!currentUser) {
            return next(new AppError_1.AppError('The user belonging to this token does no longer exist.', 401));
        }
        req.user = currentUser;
        next();
    }
    catch (error) {
        return next(new AppError_1.AppError('Invalid token or session expired', 401));
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map