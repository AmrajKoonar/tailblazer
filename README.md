# TailBlazer - Lost Animal Reporting System - CMPT 272 Assignment 4 - Amraj Koonar - 301559468

A fully client-side lost animal reporting web application built with React, TypeScript, and third-party APIs.

---

## Project Overview

TailBlazer is a web application for reporting and tracking lost animals. Users may submit lost animal reports with photos and map locations, browse all reports on an interactive map, and mark animals as found. When a pet is found, the owner can locate their post and use a password to mark it as resolved.
This website was created from CMPT 272 assignment 4, Spring 2026, by Amraj Koonar (301559468). 

---

## Features Implemented
- **Submit Reports** - Fill out a form with the animal's name, type, photo, description, contact info, and last seen location picked from a map.
- **Photo Upload** - Images are uploaded to ImgBB and the hosted URL is stored with the report.
- **Map-Based Location** - Click on a Leaflet map to select coordinates; the address is reverse-geocoded via Nominatim.
- **Persistent Storage** - All reports are stored in JSONBin as a shared JSON array.
- **Home Map View** - An interactive Leaflet map shows pins for all lost animal reports. Clicking a pin opens a popup with a thumbnail and link to the detail page.
- **Browse & Filter** - A grid of report cards with filters for animal type and status (lost / found / all).
- **Detail Page** - Displays all report fields including photo, description, contact, address, coordinates, date, and status.
- **Mark as Found** - On the detail page, enter the password used at report creation to change the status to "found."

---

## Technologies Used

- [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tooling)
- [React Router](https://reactrouter.com/) (client-side routing)
- [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) (maps)
- [JSONBin](https://jsonbin.io/) (persistent report storage)
- [ImgBB](https://api.imgbb.com/) (image hosting)
- [Nominatim / OpenStreetMap](https://nominatim.openstreetmap.org/) (reverse geocoding)

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### 1. Install Dependencies

```bash
cd tailblazer
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your API keys:

```bash
cp .env_example .env
```

Edit `.env` with your actual values:

| Variable | Where to Get It |
|---|---|
| `VITE_IMGBB_API_KEY` | Sign up at [imgbb.com](https://imgbb.com/) → About → API → Get API Key |
| `VITE_JSONBIN_BIN_ID` | Create a bin at [jsonbin.io](https://jsonbin.io/) with initial content `{"reports":[]}`, then copy the Bin ID |
| `VITE_JSONBIN_API_KEY` | Copy your Master Key from JSONBin dashboard → API Keys. If the key contains `$`, escape each `$` with `\` inside `.env`. Example: `\$2a\$10\$...` | 

### 3. Run Locally

```bash
npm run dev
```

The app will open at `http://localhost:5173` (default Vite port).

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## Deployment (GitHub Pages)

The app is deployed as a static Vite build to GitHub Pages via GitHub Actions.

- **Live URL:** https://amrajkoonar.github.io/tailblazer/
- **Trigger:** every push to the `main` branch (and manual runs via the Actions tab → *Deploy to GitHub Pages* → *Run workflow*).
- **Workflow:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs `npm ci`, `npm run build`, then uploads `dist/` and deploys with the official GitHub Pages actions.
- **Base path:** `vite.config.ts` sets `base: "/tailblazer/"` and the router uses `basename={import.meta.env.BASE_URL}` so assets and client-side routes work under `/tailblazer/`.
- **SPA fallback:** the `postbuild` step copies `dist/index.html` to `dist/404.html`, so refreshing or directly opening a nested route (e.g. `/tailblazer/reports/:id`) still loads the app.

### One-time GitHub setup

1. In the repo, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
2. Add the build-time environment variables under **Settings → Secrets and variables → Actions → New repository secret**:
   - `VITE_IMGBB_API_KEY`
   - `VITE_JSONBIN_BIN_ID`
   - `VITE_JSONBIN_API_KEY`

   Note: unlike the local `.env`, GitHub secret values are stored raw — do **not** escape `$` characters in the JSONBin key.
3. Push to `main` (or run the workflow manually) to trigger the first deployment.

### Environment variable note

All app variables are prefixed with `VITE_`, which means Vite **inlines them into the client bundle at build time**. They are therefore publicly visible in the deployed frontend — this is expected for a fully client-side app. Do not put anything that must stay private in `VITE_` variables. The real `.env` file is git-ignored and is never committed; only `.env_example` is tracked.

---

## Limitations / Known Issues

- JSONBin free tier has rate limits; rapid successive writes may occasionally conflict.
- Nominatim has a usage policy of max 1 request per second; excessive clicking on the map may hit this limit.

---

## AI Documentation (V1 only)

AI was partially used on this website for the following uses:
- Debugging (TS files, CSS files, etc)
- Filling in placeholder text (in submit report fields)
- Cleaning up code (for readability, commenting, readme formatting)
- Brainstorming ideas/edge cases (types of user actions, designs, interactions, potential user error cases, user flow)
- Clarifying and explaining TS, React Router, REST APIs, and Leaflet related concepts that were unclear
- Assistance in UI design (styles.css) and project file architecture (folders, files, namings, organization)
- Assistance in generating .ts and .tsx files that I was struggling on
- Any final code assisted by AI was reviewed, understood, and parsed through me

All final code including file structure, CSS styling, TypeScript logic, and design decisions were written and implemented by me to ensure AI integrity was upheld.

---

### Reflection (V1 only)

AI-assisted development significantly accelerated the initial scaffolding and boilerplate creation process. I was specifically struggling on getting started on this project, where to begin, how to begin, and that left me lost and stressed. AI was also helpful for setting up TypeScript interfaces (.ts and .tsx file code), structuring the service layer, and writing consistent CSS (.css files). However, my own judgment and review was still important for making architectural decisions, ensuring the code met specific assignment requirements, and verifying that the final product worked correctly end-to-end. In conclusion, I learned that AI tools work best as a productivity multiplier and UI designer when the developer understands what the generated code is doing and can verify its correctness. Through this project I was able to experiment and play around with AI which allowed me learn this and help finalize this project!