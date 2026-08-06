ECRS — Electronic Crime Reporting System
Student Handover Package
========================================

WHAT IS IN THIS ZIP
-------------------
- Full source code (React frontend + Laravel backend)
- Project report documents (docs folder)
- Setup instructions below

WHAT YOU MUST INSTALL FIRST (on your laptop)
--------------------------------------------
1. XAMPP          https://www.apachefriends.org
2. PHP 8.2+       winget install PHP.PHP.8.2
3. Composer       https://getcomposer.org
4. Node.js LTS    https://nodejs.org

IMPORTANT: Use PHP 8.2 — NOT XAMPP's PHP 8.0!

FIRST-TIME SETUP
----------------
1. Unzip this folder anywhere (e.g. Desktop)

2. XAMPP → Start MySQL → phpMyAdmin → Create database: ecrs_koforidua

3. Backend (PowerShell):
   cd backend
   copy .env.example .env
   (Edit .env: DB_DATABASE=ecrs_koforidua, DB_USERNAME=root, DB_PASSWORD=empty)
   composer install
   php artisan key:generate
   php artisan migrate:fresh --seed

4. Frontend (new PowerShell):
   cd ..   (project root)
   copy .env.example .env
   npm install

RUN EVERY TIME (presentation day)
---------------------------------
1. XAMPP → Start MySQL
2. cd backend → php artisan serve
3. cd project root → npm run dev

URLS
----
Citizens:  http://localhost:5173
Officers:  http://localhost:5173/officer/login

LOGIN
-----
Email:    k.mensah@ecrs.gov
Password: password

Demo case: KFD-2026-489201

REPORT DOCUMENT
---------------
See docs\FULL_REPORT_WITH_SCREENSHOTS_v2.docx (in docs folder)

NEED HELP?
----------
Read HANDOVER.md in the project folder.
