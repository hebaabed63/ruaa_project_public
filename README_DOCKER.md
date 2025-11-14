# Ruaa Project - Docker Setup

This project contains a complete Docker environment for running the Ruaa application with Laravel backend and React frontend.

## Docker Architecture

The Docker setup includes:

1. **App Container**:
   - PHP 8.2 with all required extensions for Laravel
   - Node.js for React development
   - Supervisor to manage multiple processes (PHP-FPM, React Dev Server)

2. **Database Container**:
   - MySQL 8.0

3. **Web Server**:
   - Nginx to serve both Laravel and React applications

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone the repository (if not already done)
2. Navigate to the project directory
3. Run the following command to build and start all services:

```bash
docker-compose up --build
```

## Accessing the Application

- Laravel API: http://localhost/api
- React App: http://localhost:3000

## Project Structure

```
.
├── Dockerfile              # Main Docker configuration
├── docker-compose.yml      # Docker Compose services definition
├── nginx/
│   └── default.conf        # Nginx configuration
├── supervisord.conf        # Process supervisor configuration
├── init-laravel.sh         # Laravel initialization script
├── init-laravel.bat        # Windows version of initialization script
└── init-laravel.ps1        # PowerShell version of initialization script
```

## Environment Variables

The database connection is configured in the `.env` file:
- DB_HOST=db
- DB_PORT=3306
- DB_DATABASE=laravel
- DB_USERNAME=laravel
- DB_PASSWORD=password

For the React frontend, check `frontend/my-project-main/.env`:
- REACT_APP_API_URL=http://localhost/api
- PORT=3001 (internal port for development server)

## Initializing the Application

After starting the Docker containers, you need to initialize the Laravel application:

### On Linux/Mac:
```bash
./init-laravel.sh
```

### On Windows:
```cmd
init-laravel.bat
```

Or using PowerShell:
```powershell
.\init-laravel.ps1
```

This script will:
1. Wait for MySQL to be ready
2. Run Laravel migrations
3. Seed the database (optional)

## Development Workflow

1. Make changes to your Laravel code - they will be reflected immediately
2. Make changes to your React code - the development server will hot-reload
3. Access the application at http://localhost:3000

## Stopping the Services

To stop all services, press `Ctrl+C` in the terminal where docker-compose is running, or run:

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

## Additional Information

For more detailed information about the Docker setup, check:
- [DOCKER_README.md](DOCKER_README.md) - Detailed Docker instructions
- [DOCKER_ARCHITECTURE.md](DOCKER_ARCHITECTURE.md) - Architecture diagram