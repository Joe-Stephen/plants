import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = `__express__${req.originalUrl || req.url}`;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    if (Date.now() - cachedResponse.timestamp < DURATION) {
      return res.json(cachedResponse.data);
    } else {
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
