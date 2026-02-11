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
This EXE is built from `launcher/RunPortfolio.bat` (no C# launcher).

To rebuild the EXE:

```bash
npm run build:launcher
```

## Deploy to GitHub Pages

This repository includes GitHub Actions workflow:

`.github/workflows/deploy-pages.yml`

What it does:

- builds Angular from `frontend/`
- deploys static files to `gh-pages` branch when you push to `main`

Important:

- GitHub Pages cannot run your Node.js backend.
- The frontend is configured to load `frontend/src/assets/portfolio-data.json` on GitHub Pages.

After pushing to GitHub:

1. Go to repository `Settings` -> `Pages`
2. Set `Source` to `Deploy from a branch`
3. Set branch to `gh-pages` and folder to `/ (root)`
4. Wait for workflow `Deploy Portfolio to GitHub Pages` to finish
4. Open: `https://flukekazo55.github.io/portfolio/`

## Update portfolio content

Edit:

`backend/src/data/portfolio-data.js`
