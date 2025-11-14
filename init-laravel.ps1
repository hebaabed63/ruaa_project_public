# init-laravel.ps1

Write-Host "Waiting for MySQL to be ready..."

do {
    try {
        docker exec raua_db mysql -ularavel -ppassword -e "SELECT 1;" | Out-Null
        $mysqlReady = $true
    } catch {
        $mysqlReady = $false
        Start-Sleep -Seconds 2
    }
} while (-not $mysqlReady)

Write-Host "MySQL is ready. Running Laravel migrations..."

# Run Laravel migrations
docker exec raua_app php artisan migrate --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "Laravel migrations completed successfully."
} else {
    Write-Host "Error running Laravel migrations."
    exit 1
}

# Seed the database (optional)
Write-Host "Seeding the database..."
docker exec raua_app php artisan db:seed --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database seeding completed successfully."
} else {
    Write-Host "Error seeding the database."
}

Write-Host "Laravel setup completed."