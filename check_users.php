<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$users = \App\Models\User::where('role', 3)->get();

echo "Parents in database:\n";
echo "Count: " . $users->count() . "\n\n";

foreach ($users as $user) {
    echo "ID: " . $user->user_id . "\n";
    echo "Name: " . $user->name . "\n";
    echo "Email: " . $user->email . "\n";
    echo "Role: " . $user->role . "\n";
    echo "---\n";
}
