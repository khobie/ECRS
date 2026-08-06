# ECRS Backend — Step-by-Step Learning Guide

This guide walks you through building the **Electronic Crime Reporting System** backend for **Koforidua**.

---

## Project structure

```
crime report sysetem/
├── src/                  ← React frontend (Netlify)
├── backend/              ← Laravel API (this folder)
│   ├── app/Models/       ← Database models (PHP classes = tables)
│   ├── app/Http/Controllers/Api/  ← API logic
│   ├── database/migrations/       ← Table definitions
│   ├── database/seeders/          ← Sample data
│   └── routes/api.php             ← API URLs
```

**How it works:**
- Frontend (React) sends HTTP requests → Laravel API → Database → JSON response back

---

## Step 1 — Laravel installed ✅

**What we did:**
```bash
composer create-project laravel/laravel backend
php artisan install:api    # Adds Sanctum for auth + api routes
```

**Key folders:**
| Folder | Purpose |
|---|---|
| `routes/api.php` | Defines API URLs like `/api/reports` |
| `app/Models/` | Each model = one database table |
| `database/migrations/` | Creates/alters tables |
| `.env` | Config (database, app name, keys) |

---

## Step 2 — Database connection ✅

**File:** `backend/.env`

```env
APP_NAME=ECRS
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
```

> **To use MySQL (XAMPP):**
> 1. Open **XAMPP Control Panel** → Start **MySQL**
> 2. Open **phpMyAdmin** → Create database `ecrs_koforidua`
> 3. Update `.env`:
>    ```env
>    DB_CONNECTION=mysql
>    DB_HOST=127.0.0.1
>    DB_PORT=3306
>    DB_DATABASE=ecrs_koforidua
>    DB_USERNAME=root
>    DB_PASSWORD=
>    ```
> 4. Run: `php artisan migrate:fresh --seed`

**What is a migration?**
A PHP file that tells Laravel how to create a table. Running `php artisan migrate` executes them.

---

## Step 3 — Database tables created ✅

**Tables for Koforidua ECRS:**

| Table | What it stores |
|---|---|
| `zones` | Koforidua neighborhoods (Oyoko, Jumapo, etc.) |
| `police_stations` | Stations/posts in Koforidua |
| `crime_categories` | Violent Crime, Property Crime, etc. |
| `crime_types` | Armed Robbery, Theft, etc. |
| `users` | Officers (with role, station) |
| `reports` | Crime reports from citizens |
| `evidence_files` | Uploaded photos/videos |
| `investigation_notes` | Officer notes on cases |
| `case_timeline` | Status history for tracking |

**Command used:**
```bash
php artisan migrate:fresh --seed
```

---

## Step 4 — Models (PHP ↔ Database) ✅

Each model is a PHP class that talks to one table.

**Example — `Report` model:**
```php
class Report extends Model {
    public function zone() {
        return $this->belongsTo(Zone::class);  // report belongs to a zone
    }
}
```

This lets you write: `$report->zone->name` → `"Central Koforidua"`

---

## Step 5 — Seed data ✅

**File:** `database/seeders/EcrsSeeder.php`

Populates the database with:
- 10 Koforidua zones
- 5 police stations
- 6 crime categories + types
- 2 demo officers

**Command:**
```bash
php artisan db:seed
```

**Demo login (for later):**
- Email: `k.mensah@ecrs.gov`
- Password: `password`

---

## Step 6 — First API endpoints ✅

**File:** `routes/api.php`

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/health` | Check API is running |
| GET | `/api/zones` | List Koforidua zones (for report form) |
| GET | `/api/categories` | List crime categories + types |
| POST | `/api/reports` | Submit a crime report |
| GET | `/api/reports/track/{caseId}` | Track a case |

**Start the server:**
```bash
cd backend
php artisan serve
```

**Test in browser:**
- http://127.0.0.1:8000/api/health
- http://127.0.0.1:8000/api/zones
- http://127.0.0.1:8000/api/categories

---

## Step 7 — Connect frontend (NEXT)

Update React to call the API instead of mock data.

**Example — fetch zones:**
```javascript
const res = await fetch('http://127.0.0.1:8000/api/zones');
const json = await res.json();
```

---

## Coming next

| Step | Topic |
|---|---|
| 8 | Officer login API (Sanctum JWT) |
| 9 | Dashboard stats API |
| 10 | Reports list + search API |
| 11 | Investigation notes API |
| 12 | File upload for evidence |
| 13 | Deploy backend (Railway/Render) |

---

## Useful commands

```bash
php artisan serve              # Start API server
php artisan migrate            # Run new migrations
php artisan migrate:fresh --seed  # Reset DB + reseed
php artisan make:model Report -m  # Create model + migration
php artisan make:controller Api/ReportController  # Create controller
php artisan route:list         # See all API routes
```
