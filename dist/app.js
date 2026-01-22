"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.set('trust proxy', 1);
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, compression_1.default)());
app.use('/api', rateLimiter_1.apiLimiter);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', routes_1.default);
const publicPath = path_1.default.join(__dirname, 'public');
if (fs_1.default.existsSync(publicPath)) {
    app.use(express_1.default.static(publicPath));
    app.get(/(.*)/, (_req, res) => {
        res.sendFile(path_1.default.join(publicPath, 'index.html'));
    });
}
else {
    app.get('/', (_req, res) => {
        res.send('API is running successfully. <br> For frontend, please visit <a href="http://localhost:5173">http://localhost:5173</a>');
    });
}
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map