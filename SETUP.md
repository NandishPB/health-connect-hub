# Setup Guide - Health Connect Hub

This guide will help you set up the complete application with PostgreSQL database connection.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v12 or higher)
3. **npm** or **yarn**

## Database Setup

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**Start PostgreSQL service:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE DATABASE chikitsadb;
CREATE USER chikitsa_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE chikitsadb TO chikitsa_user;
\q
```

### 3. Configure Backend Environment

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env  # If .env.example exists, or create manually
```

Edit `backend/.env` with your database credentials:

```env
DATABASE_URL=postgres://chikitsa_user:your_password_here@localhost:5432/chikitsadb
JWT_SECRET=your-secret-key-change-in-production-use-a-random-string
PORT=4000
```

**Important:** Replace `your_password_here` with the password you set for the database user, and change `JWT_SECRET` to a random secure string.

## Installation

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### 1. Start PostgreSQL (if not already running)

```bash
sudo systemctl start postgresql
```

### 2. Initialize Database Schema and Seed Data

```bash
# From project root or backend directory
cd backend
npm run dev
```

In another terminal, seed the database:

```bash
curl -X POST http://localhost:4000/api/seed
```

Or use a tool like Postman or Thunder Client to POST to `http://localhost:4000/api/seed`

### 3. Start Backend Server

The backend should already be running from step 2. If not:

```bash
cd backend
npm run dev
```

Backend will be available at: `http://localhost:4000`

### 4. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth token)

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions for logged-in user (requires auth)
- `GET /api/prescriptions/:id` - Get single prescription (requires auth)
- `POST /api/prescriptions/:id/order` - Create medicine order (requires auth)

### Health Check
- `GET /health` - Check if backend and database are connected

## Testing the Setup

1. **Check database connection:**
   ```bash
   curl http://localhost:4000/health
   ```
   Should return: `{"ok":true}`

2. **Register a test user:**
   ```bash
   curl -X POST http://localhost:4000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "role": "patient"
     }'
   ```

3. **Login:**
   ```bash
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

## Troubleshooting

### Database Connection Errors

If you see `ECONNREFUSED 127.0.0.1:5432`:

1. Check if PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   ```

2. Verify database exists:
   ```bash
   sudo -u postgres psql -l | grep chikitsadb
   ```

3. Test connection manually:
   ```bash
   psql -U chikitsa_user -d chikitsadb -h localhost
   ```

### Port Already in Use

If port 4000 or 5173 is already in use, you can:
- Change `PORT` in `backend/.env`
- Change port in `frontend/vite.config.ts` or use `npm run dev -- --port 3001`

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Backend server port (default: 4000)

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:4000/api)

Create `frontend/.env` if you need to override:
```env
VITE_API_URL=http://localhost:4000/api
```

## Next Steps

1. Register users through the frontend at `http://localhost:5173/auth`
2. Login and view prescriptions
3. Create prescriptions through the database or API
4. Test medicine ordering functionality

## Notes

- The seed data includes sample hospitals, doctors, and a test prescription
- Default test user from seed: `patient1@example.local` (no password set - register new users)
- All API endpoints require authentication except `/api/auth/register` and `/api/auth/login`
- JWT tokens expire after 7 days

