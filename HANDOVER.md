# ECRS — Student Handover Guide

**Project:** Electronic Crime Reporting System (ECRS)  
**Scope:** Koforidua municipality (Eastern Region, Ghana)  
**Stack:** React + Vite + Tailwind · Laravel 12 API · MySQL  

---

## 1. What this project is

A final-year web application that lets:

- **Citizens** report crimes, track cases by Case ID, and file anonymously
- **Police officers** view a dashboard, manage reports, investigate cases, see analytics, and manage users

**Case ID format:** `KFD-2026-xxxxxx` (Koforidua)

---

## 2. What is already built

| Part | Status |
|------|--------|
| React frontend (all pages) | ✅ Done |
| Laravel API + MySQL database | ✅ Done |
| Report submission (real API) | ✅ Done |
| Case tracking (real API) | ✅ Done |
| Dashboard, Reports, Analytics, Users | ✅ Done (live data from DB) |
| Mock/fake data | ❌ Removed |
| Officer login (Sanctum auth) | ⏳ Not yet |
| Evidence file upload to server | ⏳ Not yet |
| API deployed online | ⏳ Not yet (runs on your laptop for now) |

---

## 3. Demo accounts & test data

After running migrations + seed (`php artisan migrate:fresh --seed`):

| Role | Email | Password |
|------|-------|----------|
| Investigator | `k.mensah@ecrs.gov` | `password` |
| Super Admin | `n.adusei@ecrs.gov` | `password` |

**Sample case to track:** `KFD-2026-489201`  
(Armed Robbery at Jackson's Park — pre-seeded in the database)

---

## 4. How to run on your computer

You need **3 things running:**

### A. MySQL (XAMPP)

1. Open **XAMPP Control Panel**
2. Start **Apache** and **MySQL**
3. In phpMyAdmin, create database: `ecrs_koforidua`

### B. Laravel API

```powershell
cd backend

# Copy env file if first time
copy .env.example .env
# Edit .env — set DB_DATABASE=ecrs_koforidua, DB_USERNAME=root, DB_PASSWORD=

# Use PHP 8.2+ (NOT XAMPP's PHP 8.0)
$php = "C:\Users\pc\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe"

& $php artisan key:generate
& $php artisan migrate:fresh --seed
& $php artisan serve
```

API runs at: **http://127.0.0.1:8000**  
Test: open http://127.0.0.1:8000/api/health — should show `"status": "ok"`

### C. React frontend

```powershell
cd "crime report sysetem"   # project root (not backend)
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

The `.env` file in the project root should contain:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 5. Project folder structure

```
crime report sysetem/
├── src/                    ← React frontend
│   ├── pages/              ← All screens (Landing, Report, Track, Dashboard…)
│   ├── components/         ← Navbar, sidebar, cards, layouts
│   ├── lib/api.js          ← All API calls to Laravel
│   └── data/constants.js   ← Static text only (features, municipality name)
├── backend/                ← Laravel API
│   ├── routes/api.php      ← API endpoints
│   ├── app/Http/Controllers/Api/  ← API logic
│   ├── app/Models/         ← Database models
│   ├── database/migrations/← Table definitions
│   └── database/seeders/EcrsSeeder.php  ← Koforidua demo data
├── HANDOVER.md             ← This file
└── backend/BACKEND_STEPS.md← Backend learning notes
```

---

## 6. API endpoints (reference)

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/health` | Check API is running |
| GET | `/api/zones` | Koforidua zones (report form) |
| GET | `/api/categories` | Crime categories + types |
| POST | `/api/reports` | Submit a crime report |
| GET | `/api/reports/track/{caseId}` | Track a case (citizen) |
| GET | `/api/landing/stats` | Landing page statistics |
| GET | `/api/dashboard` | Dashboard charts + recent reports |
| GET | `/api/analytics` | Analytics page data |
| GET | `/api/reports` | All reports (officer table) |
| GET | `/api/reports/{caseId}` | Full case detail (investigation) |
| GET | `/api/users` | User list |
| GET | `/api/officers` | Officers for assignment dropdown |

---

## 7. GitHub & Netlify

- **GitHub repo:** https://github.com/khobie/ECRS.git  
- **Netlify:** Frontend may be deployed there (check with your supervisor for the live URL)

> **Important:** The `backend/` folder may not be on GitHub yet. Push it before your demo so you have a full backup:

```powershell
git add backend/ src/ .env.example HANDOVER.md
git commit -m "Add Laravel API backend and connect frontend to live data"
git push origin main
```

---

## 8. What you still need for final submission

1. **Deploy Laravel API online** (Railway, Render, or Hostinger) so the examiner can test without your laptop
2. **Set `VITE_API_URL`** on Netlify to your deployed API URL
3. **Implement officer login** with Laravel Sanctum (login page exists, not wired yet)
4. **Evidence file upload** — save files to Laravel storage
5. **Write project documentation** — SRS, diagrams, user manual (for your report)

---

## 9. Common problems

| Problem | Fix |
|---------|-----|
| `could not find driver` | Enable `pdo_mysql` in PHP 8.2's `php.ini` |
| Laravel needs PHP 8.2+ | Use winget PHP, not XAMPP PHP 8.0 |
| Frontend shows API error | Start `php artisan serve` first |
| Empty dashboard charts | Normal with few reports — submit more via Report Crime |
| Netlify can't reach API | API must be deployed online, not localhost |

---

## 10. For your project report / viva

Be ready to explain:

- **Why Koforidua only** — scoped municipality, not national
- **Tech stack** — React SPA + REST API + MySQL (3-tier architecture)
- **Security** — anonymous reporting, Sanctum auth (planned), encrypted transport
- **Database design** — zones, stations, reports, timeline, investigation notes
- **Demo flow** — Report a crime → get Case ID → Track it → Officer sees it on dashboard

---

*Handed over: June 2026*
