# Job Tracker — CV Match Scoring Tool

A full-stack tool that automatically scores job postings against your CV
skills, so you can prioritise applications by genuine fit rather than
guesswork.

## Why I built this

While applying for junior software/data roles, I was manually comparing
dozens of job postings against my own CV to work out which ones were
worth prioritising. This tool automates that comparison: paste in a job
description, and it scores it 0–100 against a weighted list of your
skills, showing exactly which skills matched and which are missing.

## Tech stack

- **Backend:** Node.js, Express, TypeScript, MySQL (via `mysql2`)
- **Frontend:** React, TypeScript, Vite
- **Testing:** Jest (backend scoring logic)

## How the scoring works

The core logic lives in `backend/src/services/matchScorer.ts`. Each skill
on your CV is given a weight (1 = nice-to-have, 2 = core skill, 3 =
flagship skill). The scorer checks the job description text for each
skill using word-boundary-safe matching (so "java" doesn't false-positive
match inside "javascript"), then calculates:

```
score = (sum of weights of matched skills / sum of all weights) × 100
```

This is deliberately simple and explainable rather than a black-box ML
model — every score can be traced back to exactly which skills matched
and which didn't, which is also what the UI displays.

## Project structure

```
job-tracker/
├── backend/
│   ├── src/
│   │   ├── db/            # MySQL connection pool, schema, repository
│   │   ├── routes/        # Express API routes
│   │   ├── services/      # Core matching/scoring logic
│   │   └── index.ts       # Server entry point
│   └── tests/             # Jest tests for the scoring logic
└── frontend/
    └── src/
        ├── api/            # Fetch wrappers for the backend API
        ├── components/     # AddJobForm, JobList
        └── App.tsx
```

## Setup

### 1. Database

Create a MySQL database and run the schema:

```bash
mysql -u root -p -e "CREATE DATABASE job_tracker;"
mysql -u root -p job_tracker < backend/src/db/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # edit with your MySQL credentials
npm install
npm run dev             # starts on http://localhost:4000
```

Run the tests:

```bash
npm test
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev              # starts on http://localhost:5173
```

Open `http://localhost:5173` — the frontend proxies API calls to the
backend automatically.

## API reference

| Method | Endpoint                | Description                          |
|--------|--------------------------|---------------------------------------|
| POST   | `/api/jobs`              | Add a job posting; scores it automatically |
| GET    | `/api/jobs`               | List all jobs, sorted by match score |
| GET    | `/api/jobs/:id`            | Get a single job                     |
| PATCH  | `/api/jobs/:id/status`     | Update application status            |
| DELETE | `/api/jobs/:id`             | Remove a job                         |

## Roadmap / things I'd add next

- **Job board API integration** — automatically pull postings from Indeed/
  LinkedIn instead of manual paste-in (skipped for the MVP due to
  Terms-of-Service concerns around automated scraping on a public-facing
  deployment).
- **Editable skill weights via the UI** — currently the CV skill list is
  hard-coded in `matchScorer.ts`; a settings page would let this be
  edited without a code change.
- **Authentication** — currently single-user by design; would add auth
  if this became multi-user.
- **CV upload/parsing** — auto-extract skills from an uploaded CV file
  instead of a hard-coded list.

## Testing

The scoring logic has full unit test coverage, including edge cases like
case-insensitivity, substring false-positives (e.g. "java" vs
"javascript"), and skills containing special characters (e.g. "node.js").

```bash
cd backend
npm test
```
