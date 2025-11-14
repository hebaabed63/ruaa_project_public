<?php
// Test script to verify API functionality for delete and update

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
    
    echo "=== Testing Database Operations ===\n";
    
    // Check if we have any links
    $stmt = $pdo->query("SELECT link_id, token, organization_name FROM supervisor_links ORDER BY created_at DESC LIMIT 1");
    $link = $stmt->fetch();
    
    if ($link) {
        echo "Found link with ID: " . $link['link_id'] . "\n";
        echo "Organization: " . $link['organization_name'] . "\n";
        
        // Test update operation
        echo "\n--- Testing Update Operation ---\n";
        $newOrgName = "مديرية التربية والتعليم - رفح";
        $stmt = $pdo->prepare("UPDATE supervisor_links SET organization_name = ? WHERE link_id = ?");
        $result = $stmt->execute([$newOrgName, $link['link_id']]);
        
        if ($result) {
            echo "✅ Successfully updated organization name for link ID: " . $link['link_id'] . "\n";
            
            // Verify the update
            $stmt = $pdo->prepare("SELECT organization_name FROM supervisor_links WHERE link_id = ?");
            $stmt->execute([$link['link_id']]);
            $updatedLink = $stmt->fetch();
            
            if ($updatedLink && $updatedLink['organization_name'] === $newOrgName) {
                echo "✅ Update verification successful\n";
            } else {
                echo "❌ Update verification failed\n";
            }
        } else {
            echo "❌ Failed to update link\n";
        }
        
        // Test delete operation
        echo "\n--- Testing Delete Operation ---\n";
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
    
    echo "\n=== Database Operations Test Complete ===\n";
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
?>