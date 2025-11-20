<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use App\Models\User;

// Create a test script to send email
echo "Testing email functionality with Mailpit...\n";

try {
    // Load Laravel application
    $app = require_once 'bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    // Get a user from the database
    $user = User::first();
    
    if ($user) {
        echo "Found user: " . $user->name . " (" . $user->email . ")\n";
        
        // Send test email
        Mail::to('test@example.com')->send(new VerificationEmail($user, 'test-token-12345'));
        
        echo "Email sent successfully!\n";
        echo "Check Mailpit at http://localhost:8025 to see the captured email.\n";
    } else {
        echo "No users found in the database.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}