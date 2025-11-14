<?php
// Test script to approve a pending user directly

// Database connection settings
$host = 'localhost';
$dbname = 'rua_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Let's check what tokens exist for user ID 42 (the supervisor)
    $stmt = $pdo->query("SELECT id, token, last_used_at FROM personal_access_tokens WHERE tokenable_type = 'App\\\\Models\\\\User' AND tokenable_id = 42");
    $tokens = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($tokens)) {
        echo "No tokens found for supervisor ID 42\n";
        exit(1);
    }
    
    echo "Found " . count($tokens) . " tokens for supervisor ID 42:\n";
    foreach ($tokens as $token) {
        echo "Token ID: " . $token['id'] . " | Last used: " . ($token['last_used_at'] ?? 'Never') . "\n";
    }
    
    // Use the first token
    $supervisorToken = $tokens[0]['token'];
    echo "\nUsing supervisor token: " . substr($supervisorToken, 0, 20) . "...\n";

    // Test approving user ID 49
    $userId = 49;
    
    // Make HTTP request to approve the user
    $url = 'http://localhost:8000/api/supervisor/pending-principals/' . $userId . '/approve';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $supervisorToken,
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);
    
    echo "HTTP Code: " . $httpCode . "\n";
    echo "Content-Type: " . $contentType . "\n";
    echo "Response: " . $response . "\n";
    
    // Also check the user data before and after
    echo "\nUser data before approval:\n";
    $stmt = $pdo->prepare("SELECT user_id, name, email, status, supervisor_id FROM users WHERE user_id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        print_r($user);
    } else {
        echo "User not found in database!\n";
    }
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>