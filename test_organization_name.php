<?php
// Test script to create a supervisor link with organization name using direct PDO

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
    echo "Connected to database successfully!\n\n";
} catch (PDOException $e) {
    die("Could not connect to the database: " . $e->getMessage() . "\n");
}

function generateToken($length = 32) {
    return bin2hex(random_bytes($length/2));
}

echo "Creating test supervisor link with organization name...\n";

try {
    // Create supervisor invitation link with organization name
    $supervisorToken = generateToken();
    $stmt = $pdo->prepare("
        INSERT INTO supervisor_links (
            token, link_type, organization_id, organization_name, 
            is_active, expires_at, max_uses, used_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    
    $stmt->execute([
        $supervisorToken,
        'supervisor',
        null,
        'مديرية التربية والتعليم - غزة',
        true,
        date('Y-m-d H:i:s', strtotime('+2 weeks')),
        10,
        0
    ]);
    
    $supervisorLinkId = $pdo->lastInsertId();
    
    echo "✅ تم إنشاء رابط دعوة المشرف مع اسم المؤسسة:\n";
    echo "🏢 المؤسسة: مديرية التربية والتعليم - غزة\n";
    echo "🔗 http://localhost:3000/register/supervisor/{$supervisorToken}\n\n";

    // Create principal invitation link with supervisor name
    $principalToken = generateToken();
    $stmt = $pdo->prepare("
        INSERT INTO supervisor_links (
            token, link_type, organization_id, organization_name, 
            is_active, expires_at, max_uses, used_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    
    $stmt->execute([
        $principalToken,
        'principal',
        null,
        'مشرف المدارس الأساسية - شمال غزة',
        true,
        date('Y-m-d H:i:s', strtotime('+2 weeks')),
        5,
        0
    ]);
    
    $principalLinkId = $pdo->lastInsertId();

    echo "✅ تم إنشاء رابط دعوة مدير مدرسة مع اسم المشرف:\n";
    echo "👨‍🏫 المشرف: مشرف المدارس الأساسية - شمال غزة\n";
    echo "🔗 http://localhost:3000/register/principal?supervisor_token={$principalToken}\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>