# Production Checklist

## Environment Variables

- [ ] `NODE_ENV` set to `production`
- [ ] `PORT` configured (default 3000)
- [ ] `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` set correctly for prod database
- [ ] `JWT_SECRET` is strong and unique
- [ ] `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are LIVE keys
- [ ] `CLOUDINARY_CLOUD_NAME`, `KEY`, `SECRET` are set

## Security

- [ ] SSL/TLS Enabled (HTTPS) (handled by load balancer/reverse proxy)
- [ ] Database accessible only from application IP
- [ ] Rate limiting is enabled (Verified in app.ts)
- [ ] Helmet headers are active (Verified in app.ts)

## Performance

- [ ] Database indexes created (Verified in migrations)
- [ ] Gzip compression enabled (Verified in app.ts)
- [ ] Static assets served via CDN or optimized web server (Nginx)

## Deployment

- [ ] `npm run build` executes without error
- [ ] Database migrations run (`npx sequelize-cli db:migrate`)
- [ ] PM2 or Docker used for process management
