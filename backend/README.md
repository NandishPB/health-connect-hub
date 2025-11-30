Backend (Express) — local dev
-----------------------------

This small backend is a local developer scaffold to run the SQL schema and seed the Postgres database.

Setup

1. Create a `.env` file in `backend/` with your Postgres connection string, for example:

DATABASE_URL=postgres://username:password@localhost:5432/chikitsadb

2. Install dependencies (from the `backend` folder):

```powershell
cd backend
npm i
```

3. Start the server (dev):

```powershell
npm run dev
```

4. Seed the database (development only):

POST to the seed endpoint locally (PowerShell):

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/seed
```

Or use curl:

```powershell
curl -X POST http://localhost:4000/api/seed
```

Notes:
- The `/api/seed` endpoint will execute `database/schema.sql` then `database/seed.sql` in the repository root.
- This endpoint is intended for local development only. Do NOT expose it in production.
- If you prefer running SQL manually, you can run the files with `psql`:

```powershell
pSQL -d "postgres://username:password@localhost:5432/chikitsadb" -f database/schema.sql
pSQL -d "postgres://username:password@localhost:5432/chikitsadb" -f database/seed.sql
```
