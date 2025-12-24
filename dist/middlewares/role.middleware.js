"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const AppError_1 = require("../utils/AppError");
const authorizeRole = (...roles) => {
    return (req, _res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
//# sourceMappingURL=role.middleware.js.map