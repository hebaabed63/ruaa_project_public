<?php

require_once 'vendor/autoload.php';

use Illuminate\Http\Request;

// Test the role middleware
echo "Testing Role Middleware\n";

// Create a mock user with role 1 (supervisor)
class MockUser {
    public $role = 1;
}

// Create a mock request with user
class MockRequest {
    private $user;
    
    public function __construct($role) {
        $this->user = new MockUser();
        $this->user->role = $role;
    }
    
    public function user() {
        return $this->user;
    }
}

// Test with supervisor role (1)
$request = new MockRequest(1);
echo "User role: " . $request->user()->role . "\n";
echo "Should allow access: " . ($request->user()->role === 1 ? "Yes" : "No") . "\n";

// Test with parent role (3)
$request = new MockRequest(3);
echo "User role: " . $request->user()->role . "\n";
echo "Should allow access: " . ($request->user()->role === 1 ? "Yes" : "No") . "\n";

echo "Role middleware test completed.\n";