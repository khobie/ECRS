# Electronic Crime Reporting System (ECRS)

A modern, professional, secure crime reporting platform.
This repository contains a high-fidelity **frontend UI/UX implementation** (React + Tailwind)
covering the citizen-facing portal and the internal police command center.

> This is a design/prototype build. Data is mocked client-side. It is structured so a
> Laravel API backend (with MySQL) can be wired in later.

## Theme

| Token | Value |
| --- | --- |
| Primary — Police Blue | `#003366` |
| Secondary — Gold | `#F4B400` |
| Accent | White |

Modern card-based layout · clean dashboards · government-grade, accessible interface.

## Screens included

**Citizen portal**
1. Landing page — hero, statistics, features, "how it works", footer
2. Report Crime — 5-step form (Incident → Details → Evidence → Reporter → Review) + confirmation with generated Case ID
3. Track Report — Case ID lookup with visual status timeline

**Police command center**
4. Dashboard overview — KPI cards, crime trend, category & region charts, recent reports
5. Crime Reports — searchable / filterable / sortable table with pagination + PDF/Excel export actions
6. Case Investigation — tabbed detail (incident, notes, officer assignment, timeline) with evidence files
7. Crime Analytics — interactive hotspot map, trends, region/category breakdowns, resolution rates
8. User Management — role-based user list with add/edit/disable/reset-password + add-user modal
9. Officer Login — credentials + two-factor verification flow

Fully responsive across desktop, tablet and mobile.

## Tech stack

- **React 18** + **React Router** (SPA routing)
- **Tailwind CSS** (custom Police Blue / Gold design tokens)
- **Recharts** (data visualization)
- **lucide-react** (icons)
- **Vite** (build tooling)

## Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  components/    # Layouts, navbar, sidebar, footer, reusable UI (StatCard, ChartCard, Logo)
  pages/         # One file per screen
  data/mock.js   # Mock data (reports, users, charts, timeline, map points)
  lib/utils.js   # Helpers (formatting, Case ID generator, status/priority styles)
```

## Intended production architecture

- **Frontend:** React + Tailwind + Shadcn UI
- **Backend:** Laravel API
- **Database:** MySQL
- **Storage:** Cloud storage for evidence files
- **Maps:** Google Maps API (the analytics map is a stylized placeholder here)
- **Auth:** Laravel Sanctum / JWT, role-based access, 2FA, audit logs
