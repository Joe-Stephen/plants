"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const cache = new Map();
const DURATION = 5 * 60 * 1000;
const cacheMiddleware = (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
        if (Date.now() - cachedResponse.timestamp < DURATION) {
            return res.json(cachedResponse.data);
        }
        else {
            cache.delete(key);
        }
    }
    const originalSend = res.json;
    res.json = (body) => {
        cache.set(key, { data: body, timestamp: Date.now() });
        return originalSend.call(res, body);
    };
    next();
};
exports.cacheMiddleware = cacheMiddleware;
//# sourceMappingURL=cache.middleware.js.map