# Electronic Crime Reporting System (ECRS)

A crime reporting platform scoped to **Koforidua**, Eastern Region, Ghana.

**Stack:** React + Tailwind · Laravel 12 API · MySQL

## Features

**Citizen portal**
- Report a crime (5-step form, real API submission)
- Track report by Case ID (`KFD-2026-xxxxxx`)
- Anonymous reporting option

**Police command center**
- Dashboard with live statistics and charts
- Crime reports table (search, filter, sort)
- Case investigation view
- Crime analytics (zones, categories, hotspot map)
- User management

## Quick start

**1. MySQL** — Start XAMPP MySQL, create database `ecrs_koforidua`

**2. Backend**
```bash
cd backend
php artisan migrate:fresh --seed   # PHP 8.2+ required
php artisan serve                  # http://127.0.0.1:8000
```

**3. Frontend**
```bash
npm install
npm run dev                        # http://localhost:5173
```

Set `VITE_API_URL=http://127.0.0.1:8000/api` in `.env`

## Demo

- Track case: `KFD-2026-489201`
- Officer login (when wired): `k.mensah@ecrs.gov` / `password`

## Documentation

See **[HANDOVER.md](./HANDOVER.md)** for full setup, API reference, and submission checklist.

## Repo

https://github.com/khobie/ECRS.git
