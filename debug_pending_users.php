<?php
// Debug script to check pending users and their IDs

// Database connection settings (adjust as needed)
$host = 'localhost';
$dbname = 'rua_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get all pending users
    $stmt = $pdo->query("SELECT user_id, name, email, role, status, supervisor_id FROM users WHERE status = 'pending'");
    $pendingUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Pending Users in Database:\n";
    echo "========================\n";
    foreach ($pendingUsers as $user) {
        echo "ID: " . $user['user_id'] . " | Name: " . $user['name'] . " | Email: " . $user['email'] . " | Role: " . $user['role'] . " | Supervisor ID: " . ($user['supervisor_id'] ?? 'NULL') . "\n";
    }

    echo "\nPending Principals with Supervisors:\n";
    echo "===================================\n";
    $stmt = $pdo->query("SELECT user_id, name, email, supervisor_id FROM users WHERE role = 2 AND status = 'pending' AND supervisor_id IS NOT NULL");
    $pendingPrincipals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($pendingPrincipals as $principal) {
        echo "ID: " . $principal['user_id'] . " | Name: " . $principal['name'] . " | Email: " . $principal['email'] . " | Supervisor ID: " . $principal['supervisor_id'] . "\n";
        
        // Check if supervisor exists
        $supervisorStmt = $pdo->prepare("SELECT user_id, name FROM users WHERE user_id = ?");
        $supervisorStmt->execute([$principal['supervisor_id']]);
        $supervisor = $supervisorStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($supervisor) {
            echo "  Supervisor: " . $supervisor['name'] . " (ID: " . $supervisor['user_id'] . ")\n";
        } else {
            echo "  Supervisor: NOT FOUND\n";
        }
    }
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
?>