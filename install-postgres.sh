#!/bin/bash

echo "=========================================="
echo "PostgreSQL Installation Script"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run this script with sudo:"
    echo "  sudo bash install-postgres.sh"
    exit 1
fi

echo "Step 1: Installing PostgreSQL..."
apt update
apt install -y postgresql postgresql-contrib

echo ""
echo "Step 2: Starting PostgreSQL service..."
systemctl start postgresql
systemctl enable postgresql

echo ""
echo "Step 3: Waiting for PostgreSQL to be ready..."
sleep 3

echo ""
echo "Step 4: Creating database and user..."
sudo -u postgres psql <<EOF
-- Drop if exists (for clean reinstall)
DROP DATABASE IF EXISTS chikitsadb;
DROP USER IF EXISTS chikitsa_user;

-- Create database
CREATE DATABASE chikitsadb;

-- Create user
CREATE USER chikitsa_user WITH PASSWORD 'chikitsa123';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE chikitsadb TO chikitsa_user;

-- Connect to database and grant schema privileges
\c chikitsadb
GRANT ALL ON SCHEMA public TO chikitsa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chikitsa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO chikitsa_user;

\q
EOF

echo ""
echo "Step 5: Testing connection..."
if sudo -u postgres psql -c "\l" | grep -q chikitsadb; then
    echo "✓ Database created successfully!"
else
    echo "✗ Database creation failed!"
    exit 1
fi

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "Database: chikitsadb"
echo "User: chikitsa_user"
echo "Password: chikitsa123"
echo ""
echo "Your backend/.env should have:"
echo "DATABASE_URL=postgres://chikitsa_user:chikitsa123@localhost:5432/chikitsadb"
echo ""
echo "Next steps:"
echo "1. Verify backend/.env has the correct DATABASE_URL"
echo "2. The backend should automatically reconnect"
echo "3. Run: curl -X POST http://localhost:4000/api/seed"
echo "4. Then try registering/login at http://localhost:5173/auth"
echo ""

