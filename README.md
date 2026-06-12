# Note Taking App

A full-stack note-taking application built with the **MERN stack** (MongoDB, Express, React, Node.js). Users can create, edit, search, and organize notes into categories with full authentication and per-user data isolation.

## Features

- **User Authentication** — Register, login, and JWT-based sessions (expires in 7 days)
- **Notes CRUD** — Create, read, update, and delete notes
- **Categories** — Organize notes into custom categories; each user has their own set
- **Search** — Real-time search across note titles and content
- **Profile Management** — View account details and change your display name
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Secure** — Passwords hashed with bcrypt (12 rounds), all routes protected with JWT

## Tech Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Frontend | React 18, React Scripts            |
| Backend  | Node.js, Express                   |
| Database | MongoDB (via Mongoose)             |
| Auth     | bcryptjs, jsonwebtoken             |
| Styling  | Plain CSS (no framework)           |

## Project Structure

```
backend/
  models/        # Mongoose schemas (User, Note, Category)
  routes/        # Express route handlers (auth, notes, categories)
  middleware/    # JWT authentication middleware
  server.js      # Express entry point
  .env           # Environment variables

frontend/
  src/
    api/         # API client functions (fetch wrappers)
    components/  # React components (NoteForm, NoteList, etc.)
    App.js       # Main app with routing & state
    App.css      # All styles
```

## Getting Started

### Prerequisites

- Node.js >= 16
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
git clone https://github.com/Josin-J/Note-Taking-application.git
cd Note-Taking-application

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Or install both at once from root
npm run install-all
```

### 2. Configure environment

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Run

```bash
# Run both backend & frontend concurrently
npm run dev

# Or run them separately:
cd backend && npm run dev    # Express on :5000
cd frontend && npm start     # React on :3000
```

The frontend proxies API requests to `localhost:5000` (configured in `frontend/package.json`).

## API Endpoints

| Method | Endpoint              | Auth | Description             |
| ------ | --------------------- | ---- | ----------------------- |
| POST   | `/api/auth/register`  | No   | Create account          |
| POST   | `/api/auth/login`     | No   | Sign in                 |
| GET    | `/api/auth/me`        | Yes  | Get current user        |
| PUT    | `/api/auth/profile`   | Yes  | Update display name     |
| GET    | `/api/notes`          | Yes  | List notes (filterable) |
| POST   | `/api/notes`          | Yes  | Create note             |
| PUT    | `/api/notes/:id`      | Yes  | Update note             |
| DELETE | `/api/notes/:id`      | Yes  | Delete note             |
| GET    | `/api/categories`     | Yes  | List categories         |
| POST   | `/api/categories`     | Yes  | Create category         |
| PUT    | `/api/categories/:id` | Yes  | Rename category         |
| DELETE | `/api/categories/:id` | Yes  | Delete category         |

Query parameters for `GET /api/notes`:
- `?category=<id>` — filter by category
- `?search=<term>` — search title and content (case-insensitive)
