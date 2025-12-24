"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const AppError_1 = require("../utils/AppError");
const validate = (schema) => async (req, _res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const message = error.errors.map((e) => e.message).join(', ');
            return next(new AppError_1.AppError(`Validation Error: ${message}`, 400));
        }
        return next(error);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map