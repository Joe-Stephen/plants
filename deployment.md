# How to Deploy on Render

This guide explains how to deploy your Plant E-commerce application as a single "Monolithic" web service where the Node.js backend serves the React frontend.

## Prerequisites

- A [Render](https://render.com) account.
- Your code pushed to a GitHub repository.
- A database (can be hosted on Render or elsewhere like Aiven/PlanetScale).

## Step 1: Create a Web Service

1.  Go to the Render Dashboard and click **New +** -> **Web Service**.
2.  Connect your GitHub repository.

## Step 2: Configure the Service

Use the following settings:

| Setting           | Value                           |
| :---------------- | :------------------------------ |
| **Name**          | `plants-store` (or your choice) |
| **Runtime**       | `Node`                          |
| **Build Command** | `npm install && npm run build`  |
| **Start Command** | `npm start`                     |
| **Branch**        | `main` (or your working branch) |

> **Note on Build Command**: `npm run build` will now automatically build the server, build the React client, and copy the client files to the server's public folder.

## Step 3: Environment Variables

You must configure the following environment variables in the "Environment" tab:

```ini
NODE_ENV=production
PORT=3000

# Database
DB_HOST=your-db-host
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

# Secrets
JWT_SECRET=your-secure-secret

# External Services
SHIPROCKET_EMAIL=your-email
SHIPROCKET_PASSWORD=your-password
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 4: Verify Deployment

Once the deployment finishes, Render will provide a URL (e.g., `https://plants-store.onrender.com`).

- Visiting the root `/` should load your React application.
- API requests will go to `/api/...`.

## Step 5: Keep Service Active (Free Plan)

To prevent the free instance from spinning down after 15 minutes of inactivity:

1.  A GitHub Action has been added at `.github/workflows/keep-alive.yml`.
2.  Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
3.  Click **New repository secret**.
4.  Name: `RENDER_APP_URL`
5.  Value: Your Render App URL (e.g., `https://plants-store.onrender.com`).
6.  The workflow will ping your server every 14 minutes.
