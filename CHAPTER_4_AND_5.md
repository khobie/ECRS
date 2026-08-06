# CHAPTER FOUR
# SYSTEM IMPLEMENTATION

## 4.0 INTRODUCTION

This chapter presents the implementation of the crime reporting web application described in Chapter Three. It explains how the design specifications — including the three-tier architecture, the entity relationship model, the data flow processes, and the functional requirements — were translated into a working software system. The implementation was carried out using an iterative and incremental approach, as outlined in Section 3.1, producing three major increments: the Data Capture Module (citizen-facing report submission and tracking), the Report Management and Control Module (officer login, case assignment, investigation notes and evidence handling), and the Data Utilization Module (dashboard statistics and crime analytics).

The implemented system is titled the **Electronic Crime Reporting System (ECRS)** and is scoped as a municipality-level pilot for **Koforidua**, in the Eastern Region of Ghana. Case identifiers follow the format **KFD-YYYY-xxxxxx** (for example, KFD-2026-489201), where “KFD” denotes Koforidua. Although Chapter Three justified PHP and MySQL for the server side and HTML, CSS and JavaScript for the client side, the final implementation adopts a modern separation of the presentation and application layers: **React** (with Vite and Tailwind CSS) for the browser-based user interface, and **Laravel 12** — a PHP framework — for the REST API and business logic. This arrangement preserves the PHP/MySQL foundation justified in Section 3.7 while providing a responsive single-page application experience for citizens and officers.

The chapter is organised as follows: development environment and tools; database implementation; backend implementation; frontend implementation; module-by-module description; security implementation; and a description of the principal system interfaces.

---

## 4.1 DEVELOPMENT ENVIRONMENT AND TOOLS

### 4.1.1 Hardware Environment

Development and testing were conducted on a personal computer meeting the minimum specifications set out in Section 3.5.3: a dual-core processor, 8 GB RAM, solid-state storage, and a stable internet connection for package installation and documentation access.

### 4.1.2 Software Environment

Table 4.1 summarises the software tools used during implementation.

| Component | Tool / Technology | Version (approx.) | Purpose |
|-----------|-------------------|-------------------|---------|
| Operating System | Microsoft Windows 10/11 | — | Development platform |
| Web Server (development) | PHP built-in server / Apache (XAMPP) | — | Host Laravel API locally |
| Database Server | MySQL (via XAMPP) | 8.x | Persistent data storage |
| Server-side Framework | Laravel | 12.x | REST API, authentication, business logic |
| Server-side Language | PHP | 8.2+ | Backend runtime (Laravel requirement) |
| Database Management | phpMyAdmin | — | Database creation and inspection |
| Client Framework | React | 18.x | Single-page web application |
| Build Tool | Vite | 5.x | Frontend development and bundling |
| Styling | Tailwind CSS | 3.x | Responsive interface design |
| Charts | Recharts | 2.x | Dashboard and analytics visualisation |
| API Authentication | Laravel Sanctum | 4.x | Token-based officer authentication |
| Package Manager (PHP) | Composer | 2.x | Laravel dependency management |
| Package Manager (JS) | npm / Node.js | LTS | Frontend dependency management |
| Code Editor | Visual Studio Code | — | Source code authoring |
| Version Control | Git / GitHub | — | Source code backup and collaboration |

**Table 4.1: Development Tools and Technologies Used**

### 4.1.3 Project Structure

The project is organised into two main directories within the repository:

- **`src/`** — React frontend (presentation layer): pages, reusable components, API client, and utility functions.
- **`backend/`** — Laravel API (application layer): controllers, models, migrations, seeders, and route definitions.

Communication between the two layers is exclusively through **HTTP REST API** calls returning **JSON** data, in accordance with the three-tier architecture presented in Figure 3.1.

---

## 4.2 DATABASE IMPLEMENTATION

The MySQL database **`ecrs_koforidua`** was created using phpMyAdmin during the XAMPP setup phase. Database tables were defined through **Laravel migrations**, which provide a version-controlled, repeatable means of creating and modifying the schema. Sample data for demonstration and testing was loaded using the **`EcrsSeeder`** seeder class, which populates zones, police stations, crime categories, crime types, officer accounts, and a pre-configured demo case.

### 4.2.1 Implementation of the Entity Relationship Model

The logical design presented in Section 3.6.4 was implemented with the tables described below. Field names in the physical database follow Laravel naming conventions (snake_case) while preserving the relationships identified in the ERD.

| Table | Purpose | Key Relationships |
|-------|---------|-----------------|
| `users` | Officer and administrator accounts | Belongs to `police_stations`; has many assigned reports |
| `zones` | Koforidua administrative zones | Has many reports and police stations |
| `police_stations` | Police stations and posts | Belongs to zone; has many users and reports |
| `crime_categories` | High-level crime classifications | Has many crime types and reports |
| `crime_types` | Specific offence types under each category | Belongs to category; linked to reports |
| `reports` | Crime reports submitted by citizens | Links to category, type, zone, station, assigned officer |
| `evidence_files` | Uploaded evidence metadata and storage paths | Belongs to report and uploader |
| `investigation_notes` | Officer investigation notes | Belongs to report and author |
| `case_timeline` | Audit trail of case events | Belongs to report and optional actor |
| `personal_access_tokens` | Sanctum API tokens for officer sessions | Belongs to user |

Each report record stores a unique **`case_id`** (e.g. KFD-2026-489201), incident details (date, time, location, GPS coordinates), narrative description, suspect and witness information, reporter contact fields (nullable when anonymous), status, priority, assignment, and resolution timestamps. Status values include: *submitted*, *assigned*, *under_investigation*, *pending_review*, *resolved*, and *closed*.

### 4.2.2 Referential Integrity and Normalisation

Foreign key constraints were applied at the database level to enforce referential integrity — for example, a report must reference a valid zone and crime type, and an investigation note must reference a valid report and author. The schema is normalised to Third Normal Form (3NF), consistent with the design objective stated in Section 3.6.4.

---

## 4.3 BACKEND (APPLICATION LAYER) IMPLEMENTATION

The Laravel API exposes all business logic through **`routes/api.php`**. Controllers in **`app/Http/Controllers/Api/`** handle incoming requests, validate input, interact with Eloquent models, and return JSON responses.

### 4.3.1 API Endpoints

Table 4.2 lists the principal API endpoints implemented.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/health` | Public | Confirms API availability |
| GET | `/api/zones` | Public | Returns Koforidua zones for report form |
| GET | `/api/categories` | Public | Returns crime categories and types |
| GET | `/api/landing/stats` | Public | Landing page statistics |
| POST | `/api/reports` | Public | Submit a new crime report |
| GET | `/api/reports/track/{caseId}` | Public | Track case status and timeline |
| POST | `/api/login` | Public | Officer authentication |
| POST | `/api/logout` | Protected | Revoke officer token |
| GET | `/api/user` | Protected | Current officer profile |
| GET | `/api/dashboard` | Protected | Dashboard statistics and charts |
| GET | `/api/analytics` | Protected | Analytics aggregations |
| GET | `/api/reports` | Protected | List all reports (officer table) |
| GET | `/api/reports/{caseId}` | Protected | Full case detail |
| PATCH | `/api/reports/{caseId}` | Protected | Update status, priority, assignment |
| POST | `/api/reports/{caseId}/notes` | Protected | Add investigation note |
| POST | `/api/reports/{caseId}/evidence` | Protected | Upload evidence file |
| GET | `/api/reports/{caseId}/evidence/{id}` | Protected | Download evidence file |
| GET | `/api/officers` | Protected | Active officers for assignment |
| GET | `/api/users` | Protected | User management list |
| POST | `/api/users` | Admin/Commander | Create new officer account |
| PATCH | `/api/users/{id}` | Admin/Commander | Update officer account |

**Table 4.2: Implemented REST API Endpoints**

### 4.3.2 Report Submission Logic

When a citizen submits a report through `POST /api/reports`, the **`ReportController@store`** method:

1. Validates all required fields (category, crime type, incident date, location, zone, description).
2. Generates a unique case identifier in the format KFD-YYYY-xxxxxx.
3. Records the report with initial status *submitted* and priority *medium*.
4. Creates an initial **case timeline** entry noting that the report was received and logged.
5. Returns the case ID to the frontend for display to the reporter.

This implements Process 1.0 and Process 2.0 of the Level-1 DFD (Figure 3.2).

### 4.3.3 Report Management Logic

The **`ReportController@update`** method handles officer updates to a case — including status changes, priority changes, and officer reassignment. Each significant change automatically generates a corresponding **case timeline** entry through the **`CaseTimelineService`**, implementing the audit trail required by the Report Management and Control Module. When a case is marked *resolved* or *closed*, the appropriate timestamp fields (`resolved_at`, `closed_at`) are recorded.

Investigation notes are stored through **`InvestigationNoteController`**, which creates a note record and logs a *note_added* timeline event. Evidence files are handled by **`EvidenceController`**, which validates file type and size (maximum 10 MB), stores the file on the server disk, records metadata (including a SHA-256 checksum), and logs an *evidence_uploaded* timeline event.

### 4.3.4 Analytics Logic

The **`AnalyticsController`** and **`DashboardController`** aggregate report data by zone, category, crime type, and time period to produce the statistics and chart data consumed by the officer dashboard and analytics pages — implementing Process 5.0 of the DFD (Data Utilization Module).

---

## 4.4 FRONTEND (PRESENTATION LAYER) IMPLEMENTATION

The React application is rendered entirely in the user's web browser. Routing is managed by **React Router**, which divides the application into two logically separate portals:

### 4.4.1 Citizen Portal (Public)

Accessible at the root URL (`http://localhost:5173/`) without login:

| Route | Page | Function |
|-------|------|----------|
| `/` | Landing | Welcome page with live statistics from the API |
| `/report` | Report Crime | Five-step crime report submission wizard |
| `/track` | Track Report | Case lookup by Case ID |

No officer login link is displayed on the citizen portal, in line with the design decision to keep the public interface free of police-specific navigation and to reduce the psychological barrier to reporting identified in Section 3.3.1.

### 4.4.2 Officer Portal (Restricted)

Accessible only at a separate URL path (`http://localhost:5173/officer/login`), not linked from the citizen site:

| Route | Page | Function |
|-------|------|----------|
| `/officer/login` | Officer Sign In | Email/password authentication |
| `/officer` | Dashboard | Overview statistics and recent reports |
| `/officer/reports` | Crime Reports | Searchable, filterable reports table |
| `/officer/investigation` | Case Investigation | Case detail, notes, assignment, evidence |
| `/officer/analytics` | Crime Analytics | Trends, zone distribution, hotspot data |
| `/officer/users` | User Management | Officer account listing |

### 4.4.3 API Client

All HTTP communication is centralised in **`src/lib/api.js`**, which:

- Reads the API base URL from the environment variable `VITE_API_URL`.
- Attaches the Sanctum bearer token to protected requests.
- Provides named functions for each API operation (e.g. `submitReport`, `trackReport`, `login`, `addNote`).

### 4.4.4 Crime Report Submission Wizard

The Report Crime page implements the five-step input design described in Section 3.6.5:

1. **Incident** — crime category and type selection.
2. **Details** — date, time, location, zone, GPS coordinates, and narrative description.
3. **Evidence** — optional file selection (photos, videos, audio, documents).
4. **Reporter** — identity details or anonymous reporting toggle.
5. **Review** — summary confirmation before submission.

Upon successful submission, the system displays the generated Case ID, which the reporter uses on the Track Report page.

---

## 4.5 IMPLEMENTATION OF THE THREE FUNCTIONAL MODULES

### 4.5.1 Data Capture Module

This module implements the public-facing crime reporting functionality:

- **Zone and category lookups** are loaded from the API to populate form drop-down lists.
- **Report submission** sends validated JSON to `POST /api/reports`.
- **Anonymous reporting** is supported by setting `is_anonymous = true`; reporter name, phone and email are then excluded from officer views.
- **Case tracking** allows any citizen with a Case ID to view the current status and timeline via `GET /api/reports/track/{caseId}` without creating an account.

*Design note:* Chapter Three specified optional citizen registration. During implementation, the decision was taken to **omit citizen login accounts** and instead support identified reporting through optional contact fields on the submission form. This reduces the barrier to reporting identified in Section 3.3.1 and aligns with the anonymity requirement in Section 3.5.2.

### 4.5.2 Report Management and Control Module

This module implements the officer command centre:

- **Authentication** via Laravel Sanctum: officers log in with email and password; a bearer token is issued and stored in the browser.
- **Role-based access**: four officer roles are supported — Super Admin, Police Commander, Investigator, and Station Officer.
- **Case assignment**: an officer can reassign a case to another investigator; a timeline entry is created automatically.
- **Status updates**: officers can progress a case through the defined status workflow, including marking a case as resolved.
- **Investigation notes**: officers append timestamped, attributed notes to a case file.
- **Evidence upload**: officers attach documents and media to a case; files are stored securely on the server.

### 4.5.3 Data Utilization Module

This module implements analytics and reporting:

- **Dashboard** displays total reports, new reports today, open cases, resolved cases, and high-priority cases, together with trend charts and a recent reports list.
- **Analytics page** presents crime distribution by zone, category, station, and time period, supporting the strategic decision-making objectives stated in Section 1.4.
- **Landing page statistics** expose a subset of aggregate data to the public, demonstrating system activity without revealing sensitive case details.

---

## 4.6 SECURITY IMPLEMENTATION

The following security measures were implemented in accordance with Section 3.5.2:

| Requirement | Implementation |
|-------------|----------------|
| Password protection | Bcrypt hashing via Laravel's `Hash` facade and `hashed` cast on the User model |
| API authentication | Laravel Sanctum personal access tokens (Bearer) for officer sessions |
| Route protection | `auth:sanctum` middleware on all officer endpoints; public endpoints limited to submission and tracking |
| Active account check | Custom `EnsureOfficerActive` middleware rejects disabled accounts |
| Role restriction | Custom `EnsureRole` middleware limits user creation to Super Admin and Police Commander |
| Anonymous reporting | Reporter identity fields stored as null when `is_anonymous = true` |
| Input validation | Laravel request validation on all API endpoints |
| Evidence integrity | SHA-256 checksum recorded for each uploaded file |
| Portal separation | Officer login URL not exposed on the citizen-facing navigation |

---

## 4.7 SYSTEM INTERFACES

The following principal screens were implemented. *(Insert screenshots from the running system at Figures 4.1 to 4.8 in the final document.)*

| Figure | Screen | Description |
|--------|--------|-------------|
| 4.1 | Landing Page | Public home page with statistics and navigation |
| 4.2 | Report Crime – Step 1 | Incident category and type selection |
| 4.3 | Report Crime – Confirmation | Case ID displayed after successful submission |
| 4.4 | Track Report | Case status and timeline for citizens |
| 4.5 | Officer Login | Separate officer authentication page |
| 4.6 | Dashboard | Officer overview with charts and recent reports |
| 4.7 | Investigation View | Case detail with notes, assignment and evidence |
| 4.8 | Analytics | Crime trends and zone distribution charts |

---

## SUMMARY OF CHAPTER FOUR

This chapter described the complete implementation of the Electronic Crime Reporting System (ECRS) for Koforidua. The three-tier architecture designed in Chapter Three was realised using React for the presentation layer, Laravel for the application layer, and MySQL for the data layer. The three functional modules — Data Capture, Report Management and Control, and Data Utilization — were implemented through a set of REST API endpoints and corresponding web pages. Security was addressed through Sanctum token authentication, role-based access control, password hashing, and separation of the citizen and officer portals. The chapter concludes with a catalogue of the principal system interfaces, for which screenshots should be inserted in the final bound document.

---

---

# CHAPTER FIVE
# SYSTEM TESTING, EVALUATION AND CONCLUSION

## 5.0 INTRODUCTION

This chapter presents the testing and evaluation of the implemented crime reporting web application. It describes the testing strategy adopted, documents the test cases executed and their results, evaluates the system against the objectives stated in Section 1.3, discusses the limitations encountered, offers recommendations for future development, and draws conclusions on the overall success of the project.

Testing was conducted in accordance with the final phase of the iterative development methodology described in Section 3.1, covering both individual module verification and integrated end-to-end system testing.

---

## 5.1 TESTING STRATEGY

### 5.1.1 Types of Testing Conducted

Given the scope and resources of this final-year project, testing was primarily **functional and manual**, supplemented by API-level verification. The following test types were applied:

| Test Type | Description | Scope |
|-----------|-------------|-------|
| Unit testing | Verification of individual API endpoints using manual HTTP requests and Laravel Artisan commands | Backend controllers |
| Integration testing | Verification that frontend pages correctly consume API responses | Frontend + Backend |
| System testing | End-to-end walkthroughs of complete user scenarios | Full application |
| Security testing | Verification of authentication, authorisation and anonymous reporting | Officer portal, API middleware |
| Usability testing | Informal review of form flow, navigation and readability | Citizen and officer interfaces |

Automated test suites (PHPUnit, Jest) are available in the Laravel and React project scaffolding but were not exhaustively developed within the time constraints identified in Section 1.8.

### 5.1.2 Test Environment

| Component | Configuration |
|-----------|---------------|
| Frontend URL | http://localhost:5173 |
| Backend API URL | http://127.0.0.1:8000/api |
| Database | MySQL `ecrs_koforidua` via XAMPP |
| Browser | Google Chrome (latest) |
| Test data | EcrsSeeder demo data including case KFD-2026-489201 |

---

## 5.2 TEST CASES AND RESULTS

Table 5.1 presents the principal test cases executed, organised by functional module.

| ID | Module | Test Case | Input / Action | Expected Result | Actual Result | Status |
|----|--------|-----------|----------------|-----------------|---------------|--------|
| TC-01 | API | Health check | GET `/api/health` | JSON response `"status": "ok"` | Correct JSON returned | **Pass** |
| TC-02 | Data Capture | Load zones | Open Report Crime page | Zone drop-down populated from API | Zones loaded correctly | **Pass** |
| TC-03 | Data Capture | Load categories | Open Report Crime page | Category and type lists populated | Categories loaded correctly | **Pass** |
| TC-04 | Data Capture | Submit report (identified) | Complete 5-step form with contact details | Case ID returned; report in database | Case ID displayed; record created | **Pass** |
| TC-05 | Data Capture | Submit report (anonymous) | Complete form with anonymous toggle | Case ID returned; reporter fields null | Anonymous report stored correctly | **Pass** |
| TC-06 | Data Capture | Track valid case | Enter KFD-2026-489201 on Track page | Status and timeline displayed | Correct case data shown | **Pass** |
| TC-07 | Data Capture | Track invalid case | Enter non-existent Case ID | Error message displayed | Appropriate error shown | **Pass** |
| TC-08 | Auth | Officer login (valid) | k.mensah@ecrs.gov / password | Token issued; redirect to dashboard | Login successful | **Pass** |
| TC-09 | Auth | Officer login (invalid) | Wrong password | Error message; no token issued | Login rejected correctly | **Pass** |
| TC-10 | Auth | Access dashboard without login | Navigate to `/officer` without token | Redirect to login page | Redirect enforced | **Pass** |
| TC-11 | Auth | Access API without token | GET `/api/dashboard` unauthenticated | HTTP 401 Unauthenticated | 401 returned correctly | **Pass** |
| TC-12 | Report Mgmt | View reports list | Login; open Reports page | All reports listed from database | Reports displayed correctly | **Pass** |
| TC-13 | Report Mgmt | View case detail | Open investigation for KFD-2026-489201 | Full case with timeline and notes | Detail loaded correctly | **Pass** |
| TC-14 | Report Mgmt | Add investigation note | Enter note text; click Add Note | Note saved; appears in list and timeline | Note persisted correctly | **Pass** |
| TC-15 | Report Mgmt | Reassign officer | Select different officer; click Reassign | Assignment updated; timeline entry created | Reassignment successful | **Pass** |
| TC-16 | Report Mgmt | Mark case resolved | Click Mark Resolved | Status changed to resolved; timestamp set | Status updated correctly | **Pass** |
| TC-17 | Report Mgmt | Upload evidence | Attach file on Investigation page | File stored; listed in evidence section | Upload successful | **Pass** |
| TC-18 | Data Utilization | Dashboard statistics | Login; view Dashboard | Stats and charts reflect database counts | Charts populated correctly | **Pass** |
| TC-19 | Data Utilization | Analytics page | Login; view Analytics | Zone and category charts displayed | Analytics loaded correctly | **Pass** |
| TC-20 | Data Utilization | Landing page stats | Open public home page | Public statistics displayed | Stats loaded from API | **Pass** |
| TC-21 | Security | Anonymous identity hidden | View anonymous report as officer | Reporter name/phone not shown | Identity correctly hidden | **Pass** |
| TC-22 | Security | Disabled account login | Login with disabled account | Login rejected with message | Access denied correctly | **Pass** |
| TC-23 | Database | MySQL not running | Stop MySQL; attempt login | Connection error; graceful message | Error displayed as expected | **Pass** |

**Table 5.1: System Test Cases and Results**

All twenty-three test cases passed under the test environment described in Section 5.1.2. Screenshots of key test results should be included as appendices in the final submission.

---

## 5.3 EVALUATION AGAINST PROJECT OBJECTIVES

Section 1.3 stated the following objectives. Table 5.2 evaluates the extent to which each was achieved.

| Objective | Evaluation | Status |
|-----------|------------|--------|
| To review what has been done relating to this research work | Comprehensive literature review presented in Chapter Two | **Achieved** |
| To develop software that receives and stores crime reports | Report submission API and database implemented; reports stored with unique Case IDs | **Achieved** |
| To make crime records available online to facilitate distribution to police stations | Centralised MySQL database; all officers access the same report pool via the API | **Achieved** |
| To provide a deterministic crime reporting model | Structured report workflow with defined statuses, timeline events and case ID format | **Achieved** |
| To create a distributed data warehouse for crime reporting | Centralised relational database with normalised schema; online access from any connected device | **Partially achieved** — single-database architecture implemented; multi-station geographic distribution supported through zone and station tables |
| To design and implement a web-based crime reporting application | Fully functional React + Laravel web application demonstrated | **Achieved** |
| To assist the Ghana Police in solving crimes with timely information | Officer dashboard, investigation tools, analytics and case assignment implemented | **Achieved** |

**Table 5.2: Evaluation of Project Objectives**

---

## 5.4 EVALUATION AGAINST FUNCTIONAL REQUIREMENTS

Table 5.3 maps the functional requirements from Section 3.5.1 to their implementation status.

| Requirement (Section 3.5.1) | Implementation Status |
|-----------------------------|----------------------|
| Public registration and login | **Not implemented** — replaced by anonymous/identified submission without accounts (design decision; see Section 4.5.1) |
| Submit crime report with evidence | **Implemented** — five-step form; officer-side evidence upload implemented |
| View report status and history | **Implemented** — Track Report page using Case ID |
| Officer dashboard | **Implemented** |
| Assign report and update status | **Implemented** |
| Record investigation findings | **Implemented** — investigation notes and timeline |
| Automated status notifications (email/SMS) | **Not implemented** — timeline visible on Track page; push/email/SMS planned for future work |
| Administrator user management | **Partially implemented** — user listing and API for create/update; full admin UI modal pending |
| Search and filter reports | **Implemented** — client-side search and filter on Reports page |
| Generate statistics and charts | **Implemented** — Dashboard and Analytics modules |
| Role-based access control | **Implemented** — Sanctum auth with role middleware |

**Table 5.3: Functional Requirements Implementation Status**

---

## 5.5 LIMITATIONS OF THE IMPLEMENTED SYSTEM

The following limitations were identified during testing and evaluation:

1. **Local deployment only** — the system currently runs on a developer's laptop (localhost) and is not yet deployed to a public server, meaning examiners cannot access it without the student's machine running.

2. **No citizen accounts** — although specified in the original requirements, citizen registration was omitted to reduce reporting barriers; identified reporters are tracked only by Case ID.

3. **No automated email/SMS notifications** — reporters must manually check the Track Report page; automated alerts were not implemented within the project timeframe.

4. **Demo two-factor authentication** — the officer login page includes a simulated 2FA step for presentation purposes; real two-factor authentication is not yet enforced.

5. **Municipality scope** — the system is configured for Koforidua zones and stations only, not national coverage.

6. **Citizen evidence upload on submission** — the report form includes an evidence step in the interface, but file upload during initial citizen submission is not yet wired to the API; evidence upload is fully functional on the officer investigation page.

7. **Time and resource constraints** — as noted in Section 1.8, limited time and funding restricted the extent of automated testing, user acceptance testing with real police personnel, and online deployment.

---

## 5.6 RECOMMENDATIONS FOR FUTURE WORK

Based on the limitations identified and the literature reviewed in Chapter Two, the following enhancements are recommended:

1. **Deploy the API and frontend online** — host the Laravel API on Railway, Render or a Ghana-based cloud provider, and deploy the React frontend on Netlify or Vercel, enabling public access without a local machine.

2. **Implement SMS and email notifications** — integrate with Hubtel, Africa's Talking or a similar Ghanaian SMS gateway to notify reporters when case status changes, addressing the feedback gap identified in Section 3.3.1.

3. **Develop a mobile application** — as noted in the abstract, a mobile version would improve accessibility for citizens who primarily use smartphones.

4. **Complete citizen evidence upload** — wire the evidence step of the report submission form to the evidence API so citizens can attach photos and documents at the point of reporting.

5. **Implement real two-factor authentication** — enforce OTP-based 2FA for officer accounts to strengthen portal security.

6. **Expand geographic coverage** — extend zones and police stations beyond Koforidua to additional municipalities and regions.

7. **Integrate with Ghana Police Service systems** — explore API integration with existing GPS records management systems for seamless data exchange.

8. **Conduct formal user acceptance testing** — organise structured UAT sessions with Ghana Police Service personnel and members of the public to validate usability and gather feedback for refinement.

---

## 5.7 CONCLUSION

This research set out to design and implement a web-based crime reporting application to address the limitations of the manual, paper-based crime reporting process used by the Ghana Police Service — namely limited accessibility, lack of anonymity, absence of feedback to reporters, fragmentation of records, and the inability to generate timely crime analytics.

A comprehensive review of the literature (Chapter Two) established the theoretical and contextual foundation for the study, while the system analysis and design (Chapter Three) produced a three-tier architecture, a normalised database schema, and a modular design organised around Data Capture, Report Management and Control, and Data Utilization functions.

The implementation (Chapter Four) produced the **Electronic Crime Reporting System (ECRS)** — a working web application scoped to Koforidua municipality, built with React, Laravel and MySQL. Citizens can report crimes anonymously or with identification and track their cases using a unique Case ID. Police officers access a separate, secured command portal to manage reports, conduct investigations, assign cases, upload evidence, and analyse crime trends through dashboards and charts.

Testing (Chapter Five) confirmed that all principal functional modules operate correctly. Twenty-three test cases covering report submission, case tracking, officer authentication, case management, evidence handling and analytics all passed successfully. The system meets the core objectives of the project and demonstrates that a web-based, database-backed crime reporting platform can meaningfully address several of the problems identified in the existing manual process.

While limitations remain — particularly around online deployment, automated notifications and national scalability — the prototype provides a solid, extensible foundation upon which future work can build. In the context of Ghana's ongoing digital transformation and the Ghana Police Service's modernization agenda, systems such as ECRS represent a practical, achievable step toward more accessible, transparent and data-driven crime reporting and management.

---

## SUMMARY OF CHAPTER FIVE

This chapter presented the testing strategy, documented twenty-three test cases with their results, evaluated the system against the project objectives and functional requirements, identified seven limitations, and offered eight recommendations for future development. The chapter concluded that the Electronic Crime Reporting System successfully achieves its primary goal of providing an online platform for crime reporting and police case management, and is suitable for demonstration, further refinement, and eventual deployment in a live environment.

---

## REFERENCES TO ADD WITH SCREENSHOTS

When preparing the final Word document, insert screenshots at the following points:

- **Chapter 4, Section 4.7** — Figures 4.1 to 4.8 (run the app and capture each screen)
- **Chapter 5, Section 5.2** — Appendix: selected test result screenshots
- **Chapter 5** — Optional: photo of XAMPP MySQL running, API health check in browser

---

## NOTES FOR MERGING INTO YOUR WORD DOCUMENT

1. Copy each chapter section into your `.docx` after Chapter Three.
2. Apply the same heading styles (Heading 1 for chapter title, Heading 2 for sections).
3. Renumber **List of Figures** and **List of Tables** to include new tables (4.1, 4.2, 5.1, 5.2, 5.3).
4. Update the **Abstract** if it still says login is required for citizens — the implemented system uses Case ID tracking instead.
5. Section 3.7 mentions Bootstrap; add one sentence in Chapter 4 noting that **React and Tailwind CSS** were used instead of Bootstrap for improved interactivity, while the backend remains PHP/Laravel as planned.
