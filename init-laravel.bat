@echo off

echo Waiting for MySQL to be ready...
:wait_loop
docker exec raua_db mysql -ularavel -ppassword -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 2 /nobreak >nul
    goto wait_loop
)

echo MySQL is ready. Running Laravel migrations...

docker exec raua_app php artisan migrate --force

if %errorlevel% equ 0 (
    echo Laravel migrations completed successfully.
) else (
    echo Error running Laravel migrations.
    exit /b 1
)

echo Seeding the database...
docker exec raua_app php artisan db:seed --force

if %errorlevel% equ 0 (
    echo Database seeding completed successfully.
) else (
    echo Error seeding the database.
)

echo Laravel setup completed.