@echo off

echo Starting Ruaa Project Docker Environment...
echo.

echo Building and starting Docker containers...
docker-compose up --build

echo.
echo Docker containers are now running.
echo.
echo To access the application:
echo   - Laravel API: http://localhost/api
echo   - React App: http://localhost:3000
echo.
echo To stop the containers, press Ctrl+C