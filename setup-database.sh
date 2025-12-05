#!/bin/bash

# PostgreSQL Setup Script for Health Connect Hub
# Run this script with: bash setup-database.sh

set -e

echo "=========================================="
echo "PostgreSQL Database Setup"
echo "=========================================="
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "This script needs sudo privileges. Please run:"
    echo "  sudo bash setup-database.sh"
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
echo "Step 3: Creating database and user..."
# Switch to postgres user to run psql commands
sudo -u postgres psql <<EOF
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
echo "Step 4: Updating PostgreSQL configuration..."
# Allow local connections (already default, but ensure it's set)
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /etc/postgresql/*/main/postgresql.conf || true

# Update pg_hba.conf to allow password authentication
if ! grep -q "chikitsa_user" /etc/postgresql/*/main/pg_hba.conf; then
    echo "host    chikitsadb    chikitsa_user    127.0.0.1/32    md5" >> /etc/postgresql/*/main/pg_hba.conf
fi

echo ""
echo "Step 5: Restarting PostgreSQL..."
systemctl restart postgresql

echo ""
echo "=========================================="
echo "Database setup complete!"
echo "=========================================="
echo ""
echo "Database: chikitsadb"
echo "User: chikitsa_user"
echo "Password: chikitsa123"
echo ""
echo "Connection string:"
echo "postgres://chikitsa_user:chikitsa123@localhost:5432/chikitsadb"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with the connection string above"
echo "2. Run: curl -X POST http://localhost:4000/api/seed"
echo ""

