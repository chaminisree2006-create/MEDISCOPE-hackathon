# Mediscope — Intelligent Health Report Companion & Consultation Briefing

> **Proprietary Owner & Legal Copyright Holder:** **Akhila Meesa**  
> **Explicit Copyright Statement:**  
> *"Copyright © 2026 Akhila Meesa. All rights reserved. Mediscope is a proprietary platform created, designed, and owned by Akhila Meesa."*  
> **Clinical Disclaimer:**  
> *"Mediscope is an educational health report companion, NOT a diagnostic platform or medical decision system. All outputs are intended for appointment preparation with a qualified healthcare provider."*

---

## 1. Architectural Overview & Topology

Mediscope is designed in a modern, production-grade decoupled architecture suitable for cloud containerization or unified server deployments.

```
                           +----------------------------------------+
                           |           Client Web Browser           |
                           |   (React 19 + Tailwind + Lucide Icons) |
                           +-------------------+--------------------+
                                               |
                                     HTTPS / REST JSON
                                               |
                                               v
+-----------------------------------------------------------------------------------+
|                         Mediscope FastAPI Production Server                       |
|                                                                                   |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|  | Authentication GW  |  |  PyMuPDF / OCR     |  |  Multilingual RAG Engine    |  |
|  | - Live Complexity  |  |  - 4-Stage Stepper |  |  - English / Hindi / Telugu |  |
|  | - Consent Audit    |  |  - 20+ Biomarkers  |  |  - Doctor Question Gen      |  |
|  | - JWT Session Mgmt |  |  - Normal/High/Low |  |  - Second Treatment Opinion |  |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|                                                                                   |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|  | Family Patient DB  |  | Specialist Matcher |  | Automated Email Dispatcher  |  |
|  | - Empty State Init |  | - Out-of-Range Cat |  | - HTML Branded Templates    |  |
|  | - Full CRUD System |  | - Prep Guidance    |  | - Frequency Preferences     |  |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                   Live Regional Outbreak & Sentinel Watch                   |  |
|  |                   (Influenza A H3N2, Dengue, RSV, COVID JN.1)               |  |
|  +-----------------------------------------------------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           |
                              SQLAlchemy ORM Connection
                                           |
                                           v
                       +---------------------------------------+
                       |    PostgreSQL 16 + pgvector Schema    |
                       |    (Auto-fallback to SQLite dev mode) |
                       +---------------------------------------+
```

---

## 2. Mandatory Color Palette & Design Tokens

Mediscope strictly adheres to the lavender-blue medical palette:
- **Primary Dark Blue** (`#3D52A0`): Headlines, active navigation states, primary typography.
- **Primary Active Accent** (`#7091E6`): Call-to-action buttons, active toggles, highlighted states.
- **Secondary Accent** (`#8697C4`): Subtitles, helper text, neutral icon fills.
- **Card Borders & Strokes** (`#ADBBDA`): Rounded glassmorphism card borders and dividers.
- **Light Background Canvas** (`#EDE8F5`): Global viewport canvas background.
- **White Surface Containers** (`#FFFFFF`): High-contrast card surfaces.
- **Subtle Drop Shadow**: `0 10px 25px -5px rgba(61, 82, 160, 0.08)`.

---

## 3. Core Modules & Production Capabilities

1. **Cumulative Sequential Text Hero**:
   - Strict coordinate lock: Lines do not disappear or displace.
   - Line 1: `MEDISCOPE — HEALTH REPORT COMPANION`
   - Line 2: `Understand your reports better.`
   - Line 3: `Prepare for better conversations with your healthcare professional.`
2. **Registration, Authentication & Consent Gateway**:
   - Tabbed Log In / Register modal.
   - Interactive live password complexity checklist (8+ chars, upper, lower, digit, special char).
   - Mandatory one-time permission consent checkbox on registration.
   - Account Not Found alert modal with direct switch-to-register button.
3. **Patient & Family Management**:
   - **Mandatory initial empty state** for newly registered accounts.
   - Full CRUD operations with cascade report deletion.
   - Active clinical context switcher across all views.
4. **4-Stage OCR & Biomarker Analysis**:
   - Stage 1: Secure Storage -> Stage 2: PyMuPDF OCR -> Stage 3: Range Check -> Stage 4: RAG Synthesis.
   - Normal, High, and Low status tags.
   - Longitudinal delta computations between historical and present reports.
5. **Multilingual Answers (English, Hindi, Telugu)**:
   - Instant toggle for English, हिंदी, and తెలుగు across report summaries, doctor questions, and second treatment opinions.
6. **Evidence-Based Second Treatment Opinions**:
   - Lifestyle protocols, conservative non-pharmacologic interventions, and validation checklists.
7. **Specialist Doctor Directory**:
   - Matched automatically to abnormal biomarkers (Endocrinology, Cardiology, Hematology, Nephrology, Gastroenterology).
8. **Live Outbreak Surveillance Tracker**:
   - Active viral trends, transmission vectors, and clinical guidelines.
9. **Automated Email Health Reminders**:
   - Frequency settings (Annual, Semi-Annual, Quarterly).
   - Actual formatted HTML email dispatch with instant in-app preview modal.

---

## 4. Quick Start & Execution

### Option A: Local Development Server

1. **Start the FastAPI Backend**:
   ```bash
   cd backend
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Start the React Frontend (Optional for dev hot-reload)**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open the Application**:
   - Frontend Dev Server: `http://localhost:5173`
   - Unified Full-Stack Production Server: `http://localhost:8000`
   - Interactive Swagger API Documentation: `http://localhost:8000/docs`

---

## 5. Deployment Options

### Option B: Docker Compose (PostgreSQL + pgvector)

```bash
docker-compose up --build -d
```
Access the application on port `8000`.

### Option C: Cloud Platforms (Render, Railway, Fly.io, AWS, GCP)

The repository includes a production multi-stage `Dockerfile` that builds the React application and serves it directly through FastAPI with Uvicorn.

Set the following environment variables on your cloud provider:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `SECRET_KEY`: A secure random string.
- `PORT`: `8000` (or provider default).

---

## 6. Intellectual Property & Legal Ownership

Mediscope is the exclusive intellectual property of **Akhila Meesa**.  
Copyright © 2026 Akhila Meesa. All rights reserved.
