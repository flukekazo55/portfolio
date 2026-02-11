# Portfolio Website (Angular + Node.js)

This project is a fullstack portfolio app for **Chutipong Jarernsawat**:

- `frontend/`: Angular app (UI)
- `backend/`: Node.js + Express API (`/api/portfolio`)

## Run in development

Install all dependencies:

```bash
npm run install:all
```

Then start:

```bash
npm run dev
```

This starts:

- Angular dev server: `http://localhost:4200`
- Node API server: `http://localhost:3000`

Angular uses `frontend/proxy.conf.json` so `/api/*` requests route to the backend.

## Build frontend

```bash
npm run build
```

After build, the backend can serve the compiled Angular files from:
`frontend/dist/frontend`.

## Windows launcher EXE

A launcher executable is available at:

`launcher/dist/RunPortfolio.exe`

Double-click it to open a terminal and run both frontend and backend (`npm run dev`).

To rebuild the EXE:

```bash
npm run build:launcher
```

## Update portfolio content

Edit:

`backend/src/data/portfolio-data.js`
