<?php
// Script to create test users with different statuses using direct PDO

// Database configuration - update these values to match your database
$config = [
    'host'      => '127.0.0.1',
    'database'  => 'rua_db',  // Updated database name
    'username'  => 'root',
    'password' => '',  // Update if you have a password
    'charset'   => 'utf8',
];

// Create a new PDO instance
try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}",
        $config['username'],
        $config['password']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to database successfully!\n";
} catch (PDOException $e) {
    die("Could not connect to the database: " . $e->getMessage() . "\n");
}

// Function to hash password like Laravel does
function hashPassword($password) {
    // This is a simplified version - in real Laravel, it uses bcrypt
    return password_hash($password, PASSWORD_BCRYPT);
}

// Create test users with different statuses
$testUsers = [
    [
        'email' => 'pending.supervisor@test.com',
        'name' => 'Test Pending Supervisor',
        'password' => 'password123',
        'role' => 1, // supervisor
        'status' => 'pending'
    ],
    [
        'email' => 'suspended.supervisor@test.com',
        'name' => 'Test Suspended Supervisor',
        'password' => 'password123',
        'role' => 1, // supervisor
        'status' => 'suspended'
    ]
];

try {
    foreach ($testUsers as $userData) {
        // Check if user already exists
        $stmt = $pdo->prepare("SELECT user_id FROM users WHERE email = ?");
        $stmt->execute([$userData['email']]);
        $user = $stmt->fetch();

        if ($user) {
            echo "User " . $userData['email'] . " already exists with ID: " . $user['user_id'] . "\n";
            // Update the user status
            $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE email = ?");
            $stmt->execute([$userData['status'], $userData['email']]);
            echo "Updated user status to " . $userData['status'] . "\n";
        } else {
            // Insert new user
            $hashedPassword = hashPassword($userData['password']);
            $stmt = $pdo->prepare("
                INSERT INTO users (name, email, password, role, status, email_verified_at, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())
            ");
            $stmt->execute([$userData['name'], $userData['email'], $hashedPassword, $userData['role'], $userData['status']]);
            $userId = $pdo->lastInsertId();
            echo "Created new test user " . $userData['email'] . " with ID: " . $userId . "\n";
        }

        echo "User " . $userData['email'] . " created/updated successfully!\n";
        echo "Email: " . $userData['email'] . "\n";
        echo "Password: " . $userData['password'] . "\n";
        echo "Status: " . $userData['status'] . "\n\n";
    }
} catch (PDOException $e) {
    echo "Error creating test users: " . $e->getMessage() . "\n";
}
?>