<?php

/**
 * اختبار كامل لتسجيل الدخول بـ Google OAuth
 * 
 * استخدام: php test_google_oauth.php
 */

require_once 'vendor/autoload.php';

class GoogleOAuthTester
{
    private $baseUrl;
    private $client;

    public function __construct($baseUrl = 'http://127.0.0.1:8000')
    {
        $this->baseUrl = $baseUrl;
        $this->client = new GuzzleHttp\Client([
            'base_uri' => $baseUrl,
            'timeout' => 30,
            'verify' => false
        ]);
    }

    public function testGoogleRedirect()
    {
        echo "🔍 اختبار توجيه Google OAuth...\n";
        
        try {
            $response = $this->client->get('/api/auth/google', [
                'allow_redirects' => false
            ]);
            
            if ($response->getStatusCode() === 302) {
                $location = $response->getHeader('Location')[0];
                echo "✅ نجح التوجيه إلى: " . substr($location, 0, 100) . "...\n";
                
                // التحقق من وجود المعاملات المطلوبة
                if (strpos($location, 'accounts.google.com') !== false &&
                    strpos($location, 'client_id') !== false &&
                    strpos($location, 'scope') !== false) {
                    echo "✅ معاملات Google OAuth صحيحة\n";
                    return true;
                } else {
                    echo "❌ معاملات Google OAuth غير صحيحة\n";
                    return false;
                }
            } else {
                echo "❌ فشل التوجيه. كود الاستجابة: " . $response->getStatusCode() . "\n";
                echo $response->getBody() . "\n";
                return false;
            }
        } catch (Exception $e) {
            echo "❌ خطأ في الاختبار: " . $e->getMessage() . "\n";
            return false;
        }
    }

    public function testGoogleCallback()
    {
        echo "\n🔍 اختبار Google OAuth Callback...\n";
        
        try {
            // محاولة بدون كود (يجب أن يفشل)
            $response = $this->client->get('/api/auth/google/callback', [
                'allow_redirects' => false
            ]);
            
            if ($response->getStatusCode() === 302) {
                $location = $response->getHeader('Location')[0];
                if (strpos($location, 'error=') !== false) {
                    echo "✅ معالجة صحيحة للطلب بدون كود\n";
                    return true;
                } else {
                    echo "❌ لم يتم معالجة الطلب بدون كود بشكل صحيح\n";
                    return false;
                }
            } else {
                echo "❌ استجابة غير متوقعة: " . $response->getStatusCode() . "\n";
                return false;
            }
        } catch (Exception $e) {
            echo "❌ خطأ في الاختبار: " . $e->getMessage() . "\n";
            return false;
        }
    }

    public function testGoogleCredentialLogin()
    {
        echo "\n🔍 اختبار تسجيل الدخول بـ Google Credential...\n";
        
        try {
            // محاولة بتوكن وهمي (يجب أن يفشل)
            $response = $this->client->post('/api/auth/google/login', [
                'json' => [
                    'credential' => 'fake.google.token.here'
                ],
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json'
                ]
            ]);
            
            echo "❌ قبل توكن Google وهمي (هذا خطأ)\n";
            return false;
            
        } catch (GuzzleHttp\Exception\ClientException $e) {
            if ($e->getResponse()->getStatusCode() === 401) {
                echo "✅ رفض صحيح للتوكن الوهمي\n";
                return true;
            } else {
                echo "❌ رمز خطأ غير متوقع: " . $e->getResponse()->getStatusCode() . "\n";
                return false;
            }
        } catch (Exception $e) {
            echo "❌ خطأ في الاختبار: " . $e->getMessage() . "\n";
            return false;
        }
    }

    public function testConfigurationCheck()
    {
        echo "\n🔍 اختبار تكوين Google OAuth...\n";
        
        // قراءة ملف .env
        $envFile = '.env';
        if (!file_exists($envFile)) {
            echo "❌ ملف .env غير موجود\n";
            return false;
        }
        
        $envContent = file_get_contents($envFile);
        $hasClientId = strpos($envContent, 'GOOGLE_CLIENT_ID=') !== false;
        $hasClientSecret = strpos($envContent, 'GOOGLE_CLIENT_SECRET=') !== false;
        $hasRedirectUri = strpos($envContent, 'GOOGLE_REDIRECT_URI=') !== false;
        
        if ($hasClientId) {
            echo "✅ GOOGLE_CLIENT_ID موجود في .env\n";
        } else {
            echo "❌ GOOGLE_CLIENT_ID غير موجود في .env\n";
        }
        
        if ($hasClientSecret) {
            echo "✅ GOOGLE_CLIENT_SECRET موجود في .env\n";
        } else {
            echo "❌ GOOGLE_CLIENT_SECRET غير موجود في .env\n";
        }
        
        if ($hasRedirectUri) {
            echo "✅ GOOGLE_REDIRECT_URI موجود في .env\n";
        } else {
            echo "❌ GOOGLE_REDIRECT_URI غير موجود في .env\n";
        }
        
        return $hasClientId && $hasClientSecret && $hasRedirectUri;
    }

    public function runAllTests()
    {
        echo "🚀 بدء اختبار Google OAuth Integration\n";
        echo "=====================================\n";
        
        $results = [];
        $results['config'] = $this->testConfigurationCheck();
        $results['redirect'] = $this->testGoogleRedirect();
        $results['callback'] = $this->testGoogleCallback();
        $results['credential'] = $this->testGoogleCredentialLogin();
        
        echo "\n📊 نتائج الاختبار:\n";
        echo "================\n";
        
        $passed = 0;
        $total = count($results);
        
        foreach ($results as $test => $result) {
            $status = $result ? "✅ نجح" : "❌ فشل";
            echo "$test: $status\n";
            if ($result) $passed++;
        }
        
        echo "\nالنتيجة الإجمالية: $passed/$total اختبارات نجحت\n";
        
        if ($passed === $total) {
            echo "🎉 جميع الاختبارات نجحت! Google OAuth جاهز للاستخدام\n";
        } else {
            echo "⚠️  بعض الاختبارات فشلت. يرجى مراجعة التكوين\n";
        }
        
        return $passed === $total;
    }
}

// تشغيل الاختبارات
try {
    $tester = new GoogleOAuthTester();
    $success = $tester->runAllTests();
    exit($success ? 0 : 1);
} catch (Exception $e) {
    echo "❌ خطأ فادح: " . $e->getMessage() . "\n";
    exit(1);
}