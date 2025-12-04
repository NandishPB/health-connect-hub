# Quick Setup Guide

## Install PostgreSQL

Run these commands in your terminal:

```bash
# Install PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Create Database and User

Run this command (it will prompt for your sudo password):

```bash
sudo -u postgres psql <<EOF
CREATE DATABASE chikitsadb;
CREATE USER chikitsa_user WITH PASSWORD 'chikitsa123';
GRANT ALL PRIVILEGES ON DATABASE chikitsadb TO chikitsa_user;
\c chikitsadb
GRANT ALL ON SCHEMA public TO chikitsa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chikitsa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO chikitsa_user;
\q
EOF
```

## Update Backend .env File

Edit `backend/.env` and update the DATABASE_URL:

```env
DATABASE_URL=postgres://chikitsa_user:chikitsa123@localhost:5432/chikitsadb
JWT_SECRET=ccdf2d285cfe143f18e0d24a9ce3c155
PORT=4000
```

## Seed the Database

After PostgreSQL is running and .env is updated:

```bash
curl -X POST http://localhost:4000/api/seed
```

## Verify Setup

Test the connection:

```bash
curl http://localhost:4000/health
```

Should return: `{"ok":true}`

---

## Alternative: Use the Setup Script

Or run the automated setup script:

```bash
sudo bash setup-database.sh
```

Then update `backend/.env` with the connection string shown at the end.

