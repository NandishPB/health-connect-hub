#!/bin/bash
echo "=========================================="
echo "Verifying Setup"
echo "=========================================="
echo ""

# Check PostgreSQL
echo "1. Checking PostgreSQL..."
if systemctl is-active --quiet postgresql; then
    echo "   ✓ PostgreSQL is running"
else
    echo "   ✗ PostgreSQL is not running"
fi

# Check database
echo ""
echo "2. Checking database connection..."
if PGPASSWORD=chikitsa123 psql -h localhost -U chikitsa_user -d chikitsadb -c "SELECT 1;" > /dev/null 2>&1; then
    echo "   ✓ Database connection successful"
else
    echo "   ✗ Database connection failed"
fi

# Check backend health
echo ""
echo "3. Checking backend..."
HEALTH=$(curl -s http://localhost:4000/health)
if echo "$HEALTH" | grep -q '"ok":true'; then
    echo "   ✓ Backend is healthy"
else
    echo "   ✗ Backend health check failed: $HEALTH"
fi

# Check if tables exist
echo ""
echo "4. Checking database tables..."
TABLE_COUNT=$(PGPASSWORD=chikitsa123 psql -h localhost -U chikitsa_user -d chikitsadb -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
if [ ! -z "$TABLE_COUNT" ] && [ "$TABLE_COUNT" -gt "0" ]; then
    echo "   ✓ Found $TABLE_COUNT tables in database"
else
    echo "   ✗ No tables found - database may need seeding"
    echo "   Run: curl -X POST http://localhost:4000/api/seed"
fi

echo ""
echo "=========================================="

