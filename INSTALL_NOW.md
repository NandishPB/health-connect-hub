# ⚡ INSTALL POSTGRESQL NOW

## Copy and paste these commands ONE BY ONE:

### Step 1: Install PostgreSQL
```bash
sudo apt update
```

```bash
sudo apt install -y postgresql postgresql-contrib
```

### Step 2: Start PostgreSQL
```bash
sudo systemctl start postgresql
```

```bash
sudo systemctl enable postgresql
```

### Step 3: Create Database (copy the ENTIRE block below)
```bash
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
```

### Step 4: Verify .env file
```bash
cat backend/.env
```

Should show:
```
DATABASE_URL=postgres://chikitsa_user:chikitsa123@localhost:5432/chikitsadb
```

### Step 5: Seed the database
```bash
curl -X POST http://localhost:4000/api/seed
```

Should return: `{"ok":true,"message":"Seed completed"}`

### Step 6: Test connection
```bash
curl http://localhost:4000/health
```

Should return: `{"ok":true}`

---

## ✅ After installation, your backend terminal should show:
```
✓ Database connected successfully
```

Then you can register/login at: http://localhost:5173/auth

