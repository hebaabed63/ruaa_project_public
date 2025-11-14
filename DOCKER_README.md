# Docker Development Environment for Laravel + React (Vite)

This Docker environment is configured for Laravel API development with a React frontend using Vite.

## Services Included

1. **app** - Laravel application with PHP-FPM and Node.js for Vite
2. **web** - Nginx web server for serving Laravel API
3. **db** - MySQL 8 database
4. **mailpit** - Email testing service
5. **redis** - Redis cache service

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Build and start the Docker environment:
   ```bash
   docker-compose up --build
   ```

2. After containers are running, initialize the Laravel application:
   ```bash
   docker exec -it raua_app php artisan key:generate
   docker exec -it raua_app php artisan migrate
   ```

## Accessing Services

- **React Frontend (Vite)**: http://localhost:3000
- **Laravel API**: http://localhost:8000
- **Mailpit**: http://localhost:8025
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## Environment Configuration

The [.env](file:///c%3A/laragon/www/ruaa_project/.env) file has been configured for Docker:
- DB_HOST=db
- MAIL_HOST=mailpit
- REDIS_HOST=redis
- APP_URL=http://localhost:8000
- FRONTEND_URL=http://localhost:3000

## Development Workflow

1. Make changes to your Laravel code - they will be reflected immediately
2. Make changes to your React code - Vite will hot-reload
3. Access the application at http://localhost:3000 for frontend and http://localhost:8000 for API

## Useful Commands

### Laravel Artisan Commands
```bash
docker exec -it raua_app php artisan migrate
docker exec -it raua_app php artisan migrate:fresh --seed
docker exec -it raua_app php artisan key:generate
```

### Composer Commands
```bash
docker exec -it raua_app composer install
docker exec -it raua_app composer update
```

### NPM Commands
```bash
docker exec -it raua_app npm install
docker exec -it raua_app npm run dev
```

## Stopping the Services

To stop all services:
```bash
docker-compose down
```

To stop and remove all data (including database):
```bash
docker-compose down -v
```

## Troubleshooting

If you encounter any issues:

1. Check the logs: `docker-compose logs`
2. Ensure all services are running: `docker-compose ps`
3. Rebuild the containers: `docker-compose up --build`

## CORS and Sanctum Configuration

The [.env](file:///c%3A/laragon/www/ruaa_project/.env) file is already configured with:
- FRONTEND_URL=http://localhost:3000
- SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:3000,localhost:8000,127.0.0.1:8000

Make sure your `config/cors.php` and `config/sanctum.php` files are configured correctly to allow these domains.