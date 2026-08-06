# Deploy ECRS (Free)

## 1. Frontend — Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com) and sign in with GitHub.
2. **Add new site** → **Import an existing project** → **GitHub** → select `khobie/ECRS`.
3. Build settings (auto-detected from `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Environment variables** → Add:
   ```
   VITE_API_URL = https://YOUR-RENDER-API.onrender.com/api
   ```
   Replace with your Render backend URL after step 2.
5. Click **Deploy site**.
6. Your app will be at `https://random-name.netlify.app` (rename under Site settings → Domain management).

## 2. Backend — Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com) and sign in with GitHub.
2. **New** → **Blueprint** → connect `khobie/ECRS` → apply `render.yaml`.
   - Or **New Web Service** → repo → set **Root Directory** to `backend`, **Runtime** to Docker.
3. After first deploy, open the Render **Shell** and run:
   ```bash
   touch database/database.sqlite
   php artisan migrate --seed --force
   ```
4. Test: `https://YOUR-SERVICE.onrender.com/api/health`

## 3. Connect frontend to backend

1. Copy Render URL (e.g. `https://ecrs-api.onrender.com`).
2. In Netlify → **Site configuration** → **Environment variables**:
   ```
   VITE_API_URL = https://ecrs-api.onrender.com/api
   ```
3. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**.

## Demo URLs

| Portal | URL |
|--------|-----|
| Citizen | `https://YOUR-SITE.netlify.app` |
| Officer login | `https://YOUR-SITE.netlify.app/officer/login` |

**Demo login:** `k.mensah@ecrs.gov` / `password`  
**Demo case:** `KFD-2026-489201`

## Notes

- Render **free tier sleeps** after ~15 min idle; first load may take 30–60 seconds.
- SQLite is used on Render for simplicity. For production, switch to PostgreSQL/MySQL.
- Keep local XAMPP setup as backup for viva presentations.
- If Render deploy fails, check **Logs** in the dashboard. Common fix: redeploy after pulling the latest `docker-entrypoint.sh` fix (removes broken `route:cache` on startup).

## CLI deploy (optional)

```bash
npm install
npm run build
npx netlify login
npx netlify init
npm run deploy
```

Set `VITE_API_URL` in Netlify dashboard before building for production.
