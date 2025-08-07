# Bulk Mailing Tool

A bulk mail scheduling platform built for [GYWS](https://gyws.in), a student-run NGO at IIT Kharagpur, to automate donor and outreach email campaigns.

This repository combines the two services that make up the tool:

- [`frontend/`](./frontend) — React + Vite dashboard (Tailwind CSS) for composing campaigns, managing sender agents, uploading recipient lists, and tracking send history.
- [`backend/`](./backend) — FastAPI service backed by MongoDB, handling authentication, campaign/agent management, and mail scheduling.

## Features

- Compose and send bulk email campaigns to CSV-uploaded recipient lists, with per-recipient placeholder substitution (`{{name}}`, `{{email}}`, etc.)
- Schedule single emails or full batches for future delivery via APScheduler
- Manage multiple sender "agents" (from-name, from-address, SMTP app password) per user
- Track delivery history and status (sent / failed) per recipient
- JWT-based authentication

## Tech stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router, Jodit/Quill rich text editor |
| Backend    | FastAPI, Motor (async MongoDB driver), APScheduler, `smtplib` |
| Auth       | JWT (python-jose), bcrypt/passlib |
| Database   | MongoDB |

## Getting started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Documentation

See [`docs/`](./docs) for a one-page write-up of the project (background, architecture, and outcomes).

## Origin

This project was originally developed across two repositories under the GYWS TechOps organization:

- https://github.com/GYWS-TechOps/mailkaro-frontend
- https://github.com/GYWS-TechOps/mailkaro-backend

They have been consolidated here for portfolio purposes.
