# Jones County XC

A full-stack web application with a React frontend and Go backend.

## Project Structure

```
jones-county-xc/
├── frontend/   # React app (Vite + Tailwind CSS)
├── backend/    # Go HTTP server
└── docs/       # Documentation
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173

### Backend

```bash
cd backend
go run main.go
```

Runs on http://localhost:8080

## API

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| GET    | /api/health   | Health check       |
