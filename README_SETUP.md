# 🚀 Quick Setup - Copy and Paste This!

## One Command to Install Everything:

```bash
cd /home/lenovo/Music/health-connect-hub && sudo bash run-setup.sh
```

This will:
1. ✅ Install PostgreSQL
2. ✅ Start PostgreSQL service  
3. ✅ Create database and user
4. ✅ Update .env file
5. ✅ Seed the database

---

## Or Run These Commands Manually:

```bash
# 1. Install PostgreSQL
sudo apt update && sudo apt install -y postgresql postgresql-contrib

# 2. Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 3. Create database (copy the entire block)
sudo -u postgres psql <<EOF
DROP DATABASE IF EXISTS chikitsadb;
DROP USER IF EXISTS chikitsa_user;
CREATE DATABASE chikitsadb;
CREATE USER chikitsa_user WITH PASSWORD 'chikitsa123';
GRANT ALL PRIVILEGES ON DATABASE chikitsadb TO chikitsa_user;
\c chikitsadb
GRANT ALL ON SCHEMA public TO chikitsa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chikitsa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO chikitsa_user;
\q
EOF

# 4. Verify .env file has correct DATABASE_URL
cat backend/.env

# 5. Seed database (backend must be running)
curl -X POST http://localhost:4000/api/seed

# 6. Test connection
curl http://localhost:4000/health
```

---

## After Setup:

1. ✅ Backend should show: `✓ Database connected successfully`
2. ✅ Go to: http://localhost:5173/auth
3. ✅ Register a new user
4. ✅ Login and view prescriptions!

