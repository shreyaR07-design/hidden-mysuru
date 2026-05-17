# Deployment Guide for Hidden Mysuru

This guide explains how to deploy the Hidden Mysuru application to **Vercel** and **Render**.

## 🚀 Deployment to Render (Recommended for Full-Stack)

Render is perfect for running the Express server and React frontend together.

1.  **Push your code** to a GitHub/GitLab repository.
2.  Log in to [Render](https://render.com/).
3.  Click **New +** and select **Web Service**.
4.  Connect your repository.
5.  Configure the following settings:
    -   **Environment**: `Node`
    -   **Root Directory**: `.` (default)
    -   **Build Command**: `npm install && npm run build`
    -   **Start Command**: `npm run start`
6.  Add **Environment Variables**:
    -   `NODE_ENV`: `production`
    -   `GEMINI_API_KEY`: (Your Google Gemini API Key)
    -   `JWT_SECRET`: (A random secure string for authentication)
    -   `PORT`: `3000` (Render will override this, but good to have)
7.  Click **Create Web Service**.

> **Note**: Local file uploads (`/public/uploads`) will be reset on every deployment/restart on Render's free tier. For persistent storage, consider using Google Cloud Storage or Firebase Storage.

---

## ⚡ Deployment to Vercel

Vercel is great for the React frontend, but handles the Express server as a set of Serverless Functions.

1.  Install the Vercel CLI: `npm i -g vercel` (optional).
2.  **Push your code** to GitHub and connect it to Vercel.
3.  Vercel will automatically detect the **Vite** project.
4.  The project includes a `vercel.json` and `api/server.ts` to bridge the Express app.
5.  Configure **Environment Variables** in the Vercel Dashboard:
    -   `GEMINI_API_KEY`
    -   `JWT_SECRET`
    -   `NODE_ENV`: `production`
6.  Deploy!

> **Note**: Vercel Serverless Functions have a maximum execution time (usually 10-60s on free tier). The Gemini AI generation might hit this limit if the response is slow.

---

## 🔑 Firebase Configuration

The application currently looks for `firebase-applet-config.json` in the root directory.
If you are deploying to a public repository, you should:
1.  Add `firebase-applet-config.json` to `.gitignore`.
2.  Set up Firebase manually or use environment variables to inject the config at runtime (requires code modification).

## 📁 File Uploads
Currently, uploads are stored locally in `./public/uploads`. This is **not persistent** on free-tier cloud platforms.
To fix this for production:
-   Integrate **Firebase Storage** or **AWS S3**.
-   Update the `/api/upload` route in `server.ts` to push to the cloud instead of the local filesystem.
