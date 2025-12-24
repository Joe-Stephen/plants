"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const errorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let status = 'error';
    let message = 'Internal Server Error';
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        status = err.status;
        message = err.message;
    }
    else {
        console.error('Unexpected Error:', err);
        if (process.env.NODE_ENV === 'development') {
            message = err.message;
        }
    }
    res.status(statusCode).json({
        status,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map