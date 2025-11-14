#!/bin/bash

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until docker exec raua_db mysql -ularavel -ppassword -e "SELECT 1;" > /dev/null 2>&1
do
    sleep 2
done

echo "MySQL is ready. Running Laravel migrations..."

# Run Laravel migrations
docker exec raua_app php artisan migrate --force

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "Laravel migrations completed successfully."
else
    echo "Error running Laravel migrations."
    exit 1
fi

# Seed the database (optional)
echo "Seeding the database..."
docker exec raua_app php artisan db:seed --force

if [ $? -eq 0 ]; then
    echo "Database seeding completed successfully."
else
    echo "Error seeding the database."
fi

echo "Laravel setup completed."