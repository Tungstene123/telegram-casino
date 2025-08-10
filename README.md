
# Telegram Casino Mini App (Demo)

This repository contains a small **Telegram Mini App** (web app) — frontend and a simple backend — for demo / testing only.  
It uses a virtual currency (TestCredits). **Do not use for real money gambling**.

## What's included

- `frontend/` — static Web App (HTML, CSS, JS) that works inside Telegram's Web App container.
- `backend/` — simple Node/Express server storing per-user balances in `db.json`.

## Quick start (local)

### Frontend (static)
Open `frontend/index.html` in a browser for local testing.
For Telegram integration, you must serve it over HTTPS and register URL with BotFather.

### Backend (Node)
```bash
cd backend
npm install
node server.js
```
By default the backend listens on port 4000.

## Deploy quickly

### Frontend (fast)
- Use **Vercel** or **Netlify**: create a new project, point the repo or upload the `frontend` folder, and deploy.
- Or serve the `frontend` folder from any static host (must be HTTPS).

### Backend (fast)
- Use **Render** (free tier) or **Railway**:
  - Push `backend` to GitHub.
  - Create a new Web Service on Render, connect the repo, set `npm start` as the start command.

## Registering Mini App with Telegram

1. Create a bot with [@BotFather](https://t.me/BotFather):
   - `/newbot` to create a bot; BotFather will return a bot token.
2. Register your Web App / Mini App:
   - Use BotFather commands to create a main Mini App or set the domain. You can use `/newapp` and follow instructions, or `/setdomain` to link the domain for the web widget (see Telegram docs).
   - Official docs: https://core.telegram.org/bots/webapps and https://core.telegram.org/widgets/login

## Using inside Telegram

- Once the Mini App is registered and the domain/URL set, users can open it from your bot's profile or a menu button.
- The Web App receives `initData` from Telegram (user info). For server-backed accounts, use that `initData` to identify users on your backend.

## Notes & Safety

- This is a demo. No real-money payments integrated.
- Be careful when allowing "cheater" options; only for development/testing.
