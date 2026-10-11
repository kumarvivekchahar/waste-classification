# Deployment Guide

The Circular Waste Intelligence System has been successfully separated into an API-only backend and a static frontend. Follow these instructions to deploy your application.

## 1. Backend Deployment (Render)

Your Python Flask app is fully prepared for a Render deployment. It will run as a web service.

**Steps:**
1. Push your entire repository (excluding the `new/` folder if you prefer) to GitHub.
2. Log into [Render](https://render.com) and click **New+** -> **Web Service**.
3. Connect your GitHub repository.
4. Render Configuration:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
5. Click **Create Web Service**.
6. Once deployed, Render will provide a URL like `https://your-backend-name.onrender.com`.

## 2. Frontend Deployment (Netlify)

Your frontend is a pure static site located inside the `new/` folder, ready for Netlify.

**Steps:**
1. Open the file `new/js/app.js` in a text editor.
2. On line 6, update `API_BASE` with the URL of your newly deployed Render backend:
   ```javascript
   const API_BASE = "https://your-backend-name.onrender.com";
   ```
3. Save the file.
4. Log into [Netlify](https://app.netlify.com/drop).
5. Drag and drop the **entire `new/` folder** from your computer directly into the Netlify "Drag and drop your site output folder here" box.
6. Netlify will deploy it instantly and provide you with a live frontend URL (e.g., `https://your-frontend-name.netlify.app`).

### Alternatively, using Git (Netlify):
If you want to deploy the frontend via GitHub instead of drag-and-drop:
1. Connect your repo in Netlify.
2. Set the **Base directory** to `new` (or set the publish directory to `new`).
3. Set the **Publish directory** to `.`.
4. Leave the build command empty.

## Summary of Changes
- **Backend**: Converted to pure API endpoints returning JSON (`/predict`, `/api/bins`, `/api/route`). CORS is enabled so your Netlify site can communicate with the backend. Python dependencies (like `flask-cors` and `gunicorn`) have been added to `requirements.txt`.
- **Frontend**: Separated into the `new/` folder, removing React/Vite configurations to make it a pure static app (HTML/CSS/JS). `netlify.toml` added for clean URL handling. All endpoints now point to `API_BASE` and use the built-in `fetch` API.
