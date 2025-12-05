#!/bin/bash
set -e

echo "=========================================="
echo "Complete PostgreSQL Setup & Database Seed"
echo "=========================================="
echo ""

# Step 1: Install PostgreSQL
echo "Step 1: Installing PostgreSQL..."
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Step 2: Start PostgreSQL
echo ""
echo "Step 2: Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Step 3: Wait for PostgreSQL to be ready
echo ""
echo "Step 3: Waiting for PostgreSQL to be ready..."
sleep 3

# Step 4: Create database and user
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

# Step 5: Verify .env file
echo ""
echo "Step 5: Verifying backend/.env file..."
cd "$(dirname "$0")"
if [ -f "backend/.env" ]; then
    # Update DATABASE_URL if needed
    if ! grep -q "postgres://chikitsa_user:chikitsa123@localhost:5432/chikitsadb" backend/.env; then
        echo "Updating DATABASE_URL in backend/.env..."
        sed -i 's|DATABASE_URL=.*|DATABASE_URL=postgres://chikitsa_user:chikitsa123@localhost:5432/chikitsadb|' backend/.env
    fi
    echo "✓ .env file is configured"
else
    echo "Creating backend/.env file..."
    cat > backend/.env <<ENVFILE
DATABASE_URL=postgres://chikitsa_user:chikitsa123@localhost:5432/chikitsadb
JWT_SECRET=ccdf2d285cfe143f18e0d24a9ce3c155
PORT=4000
ENVFILE
    echo "✓ Created backend/.env file"
fi

# Step 6: Test connection
echo ""
echo "Step 6: Testing database connection..."
sleep 2
if PGPASSWORD=chikitsa123 psql -h localhost -U chikitsa_user -d chikitsadb -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✓ Database connection successful!"
else
    echo "⚠ Connection test failed, but continuing..."
fi

# Step 7: Seed the database
echo ""
echo "Step 7: Seeding the database..."
sleep 2
SEED_RESPONSE=$(curl -s -X POST http://localhost:4000/api/seed 2>&1)
if echo "$SEED_RESPONSE" | grep -q '"ok":true'; then
    echo "✓ Database seeded successfully!"
else
    echo "⚠ Seed response: $SEED_RESPONSE"
    echo "You may need to run: curl -X POST http://localhost:4000/api/seed"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Database: chikitsadb"
echo "User: chikitsa_user"
echo "Password: chikitsa123"
echo ""
echo "Backend should be running at: http://localhost:4000"
echo "Frontend should be running at: http://localhost:5173"
echo ""
echo "Try registering a user at: http://localhost:5173/auth"
echo ""

