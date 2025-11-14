#!/bin/bash

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until nc -z db 3306; do
    sleep 2
done

echo "MySQL is ready."

# Run Laravel migrations if needed
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running Laravel migrations..."
    php artisan migrate --force
fi

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf