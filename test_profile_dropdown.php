<?php
// Test script to verify the profile dropdown and dashboard redirection

echo "=== Profile Dropdown and Dashboard Redirection Test ===\n\n";

// Test 1: Check if the header contains the profile dropdown
echo "1. Testing header profile dropdown...\n";

// We'll check the main page since it uses the Header component
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:8000/");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status Code: " . $http_code . "\n";
if ($http_code == 200) {
    echo "✅ Main page is accessible\n";
    
    // Check if the page contains profile dropdown elements
    if (strpos($response, 'الملف الشخصي') !== false) {
        echo "✅ Page contains profile dropdown elements\n";
    } else {
        echo "⚠️ Page might not contain profile dropdown elements\n";
    }
} else {
    echo "❌ Main page is not accessible. HTTP code: " . $http_code . "\n";
}

// Test 2: Check if the dashboard redirection logic is in place
echo "\n2. Testing dashboard component...\n";

// Read the dashboard component file
$dashboardPath = 'c:\laragon\www\ruaa_project\frontend\my-project-main\src\pages\Dashboard.jsx';
if (file_exists($dashboardPath)) {
    $dashboardContent = file_get_contents($dashboardPath);
    
    // Check if the dashboard has role-based redirection logic
    if (strpos($dashboardContent, 'userRole') !== false && strpos($dashboardContent, 'navigate') !== false) {
        echo "✅ Dashboard component contains role-based redirection logic\n";
    } else {
        echo "❌ Dashboard component does not contain role-based redirection logic\n";
    }
    
    // Check if the dashboard has the redirection useEffect
    if (strpos($dashboardContent, 'useEffect') !== false && strpos($dashboardContent, 'switch (userRole)') !== false) {
        echo "✅ Dashboard component contains useEffect for role-based redirection\n";
    } else {
        echo "❌ Dashboard component does not contain useEffect for role-based redirection\n";
    }
} else {
    echo "❌ Dashboard component file not found\n";
}

// Test 3: Check if the header component has been updated
echo "\n3. Testing header component...\n";

// Read the header component file
$headerPath = 'c:\laragon\www\ruaa_project\frontend\my-project-main\src\Header.jsx';
if (file_exists($headerPath)) {
    $headerContent = file_get_contents($headerPath);
    
    // Check if the header has userRole context
    if (strpos($headerContent, 'userRole') !== false) {
        echo "✅ Header component uses userRole from AuthContext\n";
    } else {
        echo "❌ Header component does not use userRole from AuthContext\n";
    }
    
    // Check if the header has role-based dashboard navigation
    if (strpos($headerContent, 'getDashboardPath') !== false && strpos($headerContent, 'switch (userRole)') !== false) {
        echo "✅ Header component contains role-based dashboard navigation logic\n";
    } else {
        echo "❌ Header component does not contain role-based dashboard navigation logic\n";
    }
} else {
    echo "❌ Header component file not found\n";
}

echo "\n=== Profile Dropdown and Dashboard Redirection Test Completed ===\n";