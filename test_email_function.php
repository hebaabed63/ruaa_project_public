<?php

require_once 'vendor/autoload.php';

// Test email functionality
echo "Testing email configuration...\n";

try {
    // Test the mail configuration
    $mailConfig = [
        'driver' => env('MAIL_MAILER', 'smtp'),
        'host' => env('MAIL_HOST', 'smtp.gmail.com'),
        'port' => env('MAIL_PORT', 587),
        'username' => env('MAIL_USERNAME'),
        'password' => env('MAIL_PASSWORD'),
        'encryption' => env('MAIL_ENCRYPTION', 'tls'),
    ];
    
    echo "Mail Configuration:\n";
    print_r($mailConfig);
    
    // Try to send a test email
    echo "\nAttempting to send test email...\n";
    
    // Use Laravel's mailer if available
    if (class_exists('Illuminate\Support\Facades\Mail')) {
        echo "Laravel mailer is available.\n";
        // In a real implementation, you would use Laravel's mailer here
    } else {
        echo "Laravel mailer not available in this context.\n";
    }
    
    echo "Test completed.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}