<?php
// Test script to verify delete functionality

// Database configuration
$config = [
    'host'      => '127.0.0.1',
    'database'  => 'rua_db',
    'username'  => 'root',
    'password' => '',
    'charset'   => 'utf8',
];

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}",
        $config['username'],
        $config['password']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if we have any links
    $stmt = $pdo->query("SELECT link_id, token, organization_name FROM supervisor_links ORDER BY created_at DESC LIMIT 1");
    $link = $stmt->fetch();
    
    if ($link) {
        echo "Found link with ID: " . $link['link_id'] . "\n";
        echo "Organization: " . $link['organization_name'] . "\n";
        
        // Try to delete the link
        $stmt = $pdo->prepare("DELETE FROM supervisor_links WHERE link_id = ?");
        $result = $stmt->execute([$link['link_id']]);
        
        if ($result) {
            echo "✅ Successfully deleted link with ID: " . $link['link_id'] . "\n";
        } else {
            echo "❌ Failed to delete link\n";
        }
    } else {
        echo "No links found in database\n";
    }
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
?>