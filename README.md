# Notes App

A full-stack notes (paste) application with per-user accounts and optional public sharing — notes are stored in the cloud, not the browser, so you can access them from any device.

**Live app:** [Notes App](https://notes-app-pw.vercel.app)
**Backend repo:** [Notes-App-Backend](https://github.com/Nitesh2747/Notes-App-Backend)

## Features

- **Create, edit, delete, and search notes** — a clean writing/paste interface
- **User accounts** — signup/login with hashed passwords and JWT-based sessions
- **Private by default** — every note is scoped to your account only
- **Public sharing** — opt in to generate a shareable read-only link for any note; revoke access at any time
- **No local storage** — all data is fetched from and persisted to a live database, so your notes follow you across devices

## Tech stack

**Frontend**
- React (Vite)
- Redux Toolkit — state management, async thunks for all API calls
- React Router — client-side routing, including protected routes
- Tailwind CSS
- react-hot-toast — notifications

**Backend** (see [Notes-App-Backend](https://github.com/Nitesh2747/Notes-App-Backend) for full details)
- Node.js / Express
- MongoDB Atlas + Mongoose
- JWT authentication, bcrypt password hashing

**Deployment**
- Frontend: [Vercel](https://vercel.com)
- Backend: [Render](https://render.com)
- Database: [MongoDB Atlas](https://www.mongodb.com/atlas)

## Getting started locally

### Prerequisites
- Node.js (v18+ recommended)
- The [Backend](https://github.com/Nitesh2747/Notes-App-Backend) running locally, or a deployed backend URL

### Setup

```bash
git clone https://github.com/Nitesh2747/Notes-App.git
cd notes-app
npm install
```

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:5000
```

(Point this at your local backend, or a deployed backend URL — no trailing slash.)

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or whatever port Vite assigns).

### Build for production

```bash
npm run build
```

## Deployment notes

This project is deployed on Vercel. Since it's a single-page app using client-side routing, a `vercel.json` rewrite is required so direct links (e.g. `/share/:id`) resolve correctly instead of 404ing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Set `VITE_API_URL` as an environment variable in your Vercel project settings, pointing to your deployed backend's URL.

## Project structure

```
src/
├── components/       # Page and UI components (Home, Pastes, ViewPastes, PublicPaste, Login, Signup, Navbar, ProtectedRoute)
├── redux/            # Redux slices (authSlice, pasteSlice) and async thunks for the API
├── store.js          # Redux store configuration
└── App.jsx           # Routes
```

## License

MIT
