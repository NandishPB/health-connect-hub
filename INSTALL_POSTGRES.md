# Install PostgreSQL - Step by Step

## Quick Install Commands

Copy and paste these commands **one by one** into your terminal:

### 1. Install PostgreSQL
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

### 2. Start PostgreSQL Service
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Create Database and User
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

### 4. Verify Installation
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test connection (should prompt for password: chikitsa123)
psql -U chikitsa_user -d chikitsadb -h localhost
# Type \q to exit
```

### 5. Verify .env File
Make sure `backend/.env` contains:
```env
DATABASE_URL=postgres://chikitsa_user:chikitsa123@localhost:5432/chikitsadb
JWT_SECRET=ccdf2d285cfe143f18e0d24a9ce3c155
PORT=4000
```

### 6. Restart Backend
The backend should automatically restart (nodemon). Check the terminal - you should see:
```
✓ Database connected successfully
```

### 7. Seed the Database
```bash
curl -X POST http://localhost:4000/api/seed
```

You should see: `{"ok":true,"message":"Seed completed"}`

### 8. Test Registration
Now try registering a user through the frontend at `http://localhost:5173/auth`

---

## Troubleshooting

### If you get "permission denied" errors:
Make sure you're using `sudo` for the installation and database creation commands.

### If PostgreSQL won't start:
```bash
sudo systemctl restart postgresql
sudo journalctl -u postgresql -n 50
```

### If connection still fails:
1. Check PostgreSQL is listening: `sudo netstat -tuln | grep 5432`
2. Check firewall: `sudo ufw status`
3. Verify .env file: `cat backend/.env`

### Reset everything:
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

