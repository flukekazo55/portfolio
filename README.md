# Portfolio Website (Angular)

This project is a portfolio app for **Chutipong Jarernsawat**:

- `frontend/`: Angular app (UI)

## Run in development

Install dependencies:

```bash
npm run install:all
```

Then start:

```bash
npm run dev
```

This starts the Angular dev server:
`http://localhost:4200`

## Build frontend

```bash
npm run build
```

Build output is in:
`frontend/dist/frontend`.

## Windows launcher EXE

A launcher executable is available at:

`launcher/dist/RunPortfolio.exe`

Double-click it to open a terminal and run the frontend (`npm run dev`).
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

- The frontend uses `frontend/src/assets/portfolio-data.json` for data.

After pushing to GitHub:

1. Go to repository `Settings` -> `Pages`
2. Set `Source` to `Deploy from a branch`
3. Set branch to `gh-pages` and folder to `/ (root)`
4. Wait for workflow `Deploy Portfolio to GitHub Pages` to finish
4. Open: `https://flukekazo55.github.io/portfolio/`

## Update portfolio content

Edit:

`frontend/src/assets/portfolio-data.json`
