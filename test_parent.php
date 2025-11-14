<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = \App\Models\User::where('email', 'parent@ruaa.com')->first();

if (!$user) {
    echo "User not found!\n";
    exit;
}

echo "User ID: " . $user->user_id . "\n";
echo "User Name: " . $user->name . "\n";
echo "User Email: " . $user->email . "\n";
echo "User Role: " . $user->role . "\n";

$childrenCount = \App\Models\ParentChild::where('parent_id', $user->user_id)->count();
echo "Children count: " . $childrenCount . "\n";

if ($childrenCount > 0) {
    $children = \App\Models\ParentChild::where('parent_id', $user->user_id)->get();
    foreach ($children as $child) {
        echo "  - Child: " . $child->child_name . " (School ID: " . $child->school_id . ")\n";
    }
}

// Test the controller
try {
    $controller = new \App\Http\Controllers\Api\Parent\ParentProfileController();
    $request = new \Illuminate\Http\Request();
    $request->setUserResolver(function() use ($user) {
        return $user;
    });
    
    $response = $controller->show($request);
    echo "\nAPI Response Status: " . $response->getStatusCode() . "\n";
    echo "API Response Content:\n";
    echo json_encode(json_decode($response->getContent()), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
} catch (\Exception $e) {
    echo "\nError: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
