"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.updateRole = exports.getById = exports.getAll = void 0;
const userService = __importStar(require("../services/user.service"));
const AppError_1 = require("../utils/AppError");
const getAll = async (req, res, next) => {
    try {
        const { users, metadata } = await userService.getAllUsers(req.query);
        res.status(200).json({ status: 'success', data: { users, metadata } });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(Number(req.params.id));
        res.status(200).json({ status: 'success', data: { user } });
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const updateRole = async (req, res, next) => {
    try {
        const userIdToUpdate = Number(req.params.id);
        const { role } = req.body;
        if (role !== 'USER' && role !== 'ADMIN') {
            return next(new AppError_1.AppError('Invalid role. Use USER or ADMIN.', 400));
        }
        const currentUser = req.user;
        if (currentUser && currentUser.id === userIdToUpdate && role !== 'ADMIN') {
            return next(new AppError_1.AppError('You cannot demote yourself.', 403));
        }
        const user = await userService.updateUserRole(userIdToUpdate, role);
        res.status(200).json({ status: 'success', data: { user } });
    }
    catch (error) {
        next(error);
    }
};
exports.updateRole = updateRole;
const updateStatus = async (req, res, next) => {
    try {
        const userIdToUpdate = Number(req.params.id);
        let { status } = req.body;
        if (status && status.toUpperCase() === 'BLOCKED')
            status = 'inactive';
        if (status && status.toUpperCase() === 'ACTIVE')
            status = 'active';
        if (status !== 'active' && status !== 'inactive') {
            return next(new AppError_1.AppError('Invalid status. Use ACTIVE or BLOCKED.', 400));
        }
        const currentUser = req.user;
        if (currentUser &&
            currentUser.id === userIdToUpdate &&
            status === 'inactive') {
            return next(new Error('You cannot block yourself.'));
        }
        const user = await userService.updateUserStatus(userIdToUpdate, status);
        res.status(200).json({ status: 'success', data: { user } });
    }
    catch (error) {
        next(error);
    }
};
exports.updateStatus = updateStatus;
//# sourceMappingURL=user.controller.js.map