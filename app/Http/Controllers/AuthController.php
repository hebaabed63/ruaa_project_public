<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = User::where('email', $request->email)->first();
            
            // التحقق من وجود المستخدم
            if (!$user || !$user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'خطأ في بيانات المستخدم'
                ], 500);
            }
            
            $token = $user->createToken('auth-token')->plainTextToken;
            
            // تحديد نوع الدور
            $roleNames = [
                0 => 'admin',
                1 => 'supervisor', 
                2 => 'school_manager',
                3 => 'parent'
            ];
            
            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الدخول بنجاح',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                    'role' => $roleNames[$user->role] ?? 'parent'
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'بيانات الاعتماد غير صحيحة'
        ], 401);
    }

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'fullName' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'confirmPassword' => 'required|string|same:password',
            ]);

            // إنشاء المستخدم الجديد
            $user = User::create([
                'name' => $validated['fullName'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 3, // Default role: parent
            ]);

            // لا ننشئ توكن في التسجيل - فقط نرجع نجاح العملية
            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول',
                'data' => [
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email,
                        'user_id' => $user->user_id
                    ],
                    'role' => 'parent'
                ]
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء التسجيل: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الخروج بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تسجيل الخروج'
            ], 500);
        }
    }

    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
            ]);

            $user = User::where('email', $request->email)->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'البريد الإلكتروني غير مسجل في النظام'
                ], 404);
            }

            // إنشاء توكن إعادة تعيين كلمة المرور
            $token = Str::random(60);
            
            // حفظ التوكن في جدول password_reset_tokens
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'email' => $request->email,
                    'token' => Hash::make($token),
                    'created_at' => now()
                ]
            );

            // للتبسيط، سنرجع التوكن مباشرة بدلاً من إرسال إيميل
            // في الإنتاج، يجب إرسال الرابط عبر البريد الإلكتروني
            
            return response()->json([
                'success' => true,
                'message' => 'تم إرسال رابط إعادة تعيين كلمة المرور بنجاح',
                'data' => [
                    'reset_token' => $token, // في الإنتاج، لا نرجع التوكن
                    'reset_url' => env('FRONTEND_URL', 'http://localhost:3000') . '/reset-password/' . $token
                ]
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال رابط الاستعادة: ' . $e->getMessage()
            ], 500);
        }
    }

    public function resetPassword(Request $request, $token)
    {
        try {
            $request->validate([
                'password' => 'required|string|min:6',
                'password_confirmation' => 'required|string|same:password',
            ]);

            // البحث عن التوكن في قاعدة البيانات
            $resetRecord = DB::table('password_reset_tokens')
                ->where('created_at', '>=', now()->subHour())
                ->first();

            if (!$resetRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية'
                ], 400);
            }

            // التحقق من التوكن
            $tokenValid = false;
            $validEmail = null;
            
            // البحث عن جميع records والتحقق من التوكن
            $allRecords = DB::table('password_reset_tokens')
                ->where('created_at', '>=', now()->subHour())
                ->get();
            
            foreach ($allRecords as $record) {
                if (Hash::check($token, $record->token)) {
                    $tokenValid = true;
                    $validEmail = $record->email;
                    break;
                }
            }

            if (!$tokenValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط إعادة التعيين غير صالح'
                ], 400);
            }

            // العثور على المستخدم وتحديث كلمة المرور
            $user = User::where('email', $validEmail)->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }

            // تحديث كلمة المرور
            $user->password = Hash::make($request->password);
            $user->save();

            // حذف التوكن المستخدم
            DB::table('password_reset_tokens')
                ->where('email', $validEmail)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم تغيير كلمة المرور بنجاح',
                'data' => [
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ]
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تغيير كلمة المرور: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * توجيه المستخدم إلى صفحة تسجيل الدخول بـ Google
     */
    public function redirectToGoogle()
    {
        $client_id = config('services.google.client_id');
        $redirect_uri = config('services.google.redirect');
        
        // التحقق من وجود الإعدادات
        if (!$client_id || $client_id === 'your-google-client-id-here.apps.googleusercontent.com' || !$redirect_uri) {
            return response()->json([
                'success' => false,
                'message' => 'Google OAuth غير مُعد بشكل صحيح. يرجى إعداد GOOGLE_CLIENT_ID و GOOGLE_CLIENT_SECRET في ملف .env',
                'debug' => [
                    'client_id' => $client_id ? 'مُعد' : 'غير مُعد',
                    'redirect_uri' => $redirect_uri,
                    'environment' => app()->environment()
                ]
            ], 500);
        }

        $params = [
            'client_id' => $client_id,
            'redirect_uri' => $redirect_uri,
            'scope' => 'openid profile email',
            'response_type' => 'code',
            'access_type' => 'offline',
            'prompt' => 'select_account',
            'state' => csrf_token() // إضافة CSRF protection
        ];

        $auth_url = 'https://accounts.google.com/o/oauth2/auth?' . http_build_query($params);
        
        return redirect($auth_url);
    }

    /**
     * معالجة الاستجابة من Google والتسجيل/تسجيل الدخول
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $code = $request->get('code');
            $state = $request->get('state');
            $error = $request->get('error');
            
            // إذا ألغى المستخدم العملية
            if ($error) {
                $error_description = $request->get('error_description', 'تم إلغاء تسجيل الدخول بـ Google');
                
                // إعادة توجيه إلى Frontend مع رسالة الخطأ
                $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
                return redirect($frontend_url . '/login?error=' . urlencode($error_description));
            }
            
            if (!$code) {
                $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
                return redirect($frontend_url . '/login?error=' . urlencode('لم يتم الحصول على رمز التفويض من Google'));
            }

            // تبديل الكود بـ access token
            $tokenData = $this->exchangeCodeForToken($code);
            
            if (!$tokenData || !isset($tokenData['access_token'])) {
                $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
                return redirect($frontend_url . '/login?error=' . urlencode('فشل في الحصول على access token من Google'));
            }

            // الحصول على بيانات المستخدم من Google
            $googleUser = $this->getGoogleUserInfo($tokenData['access_token']);
            
            if (!$googleUser || !isset($googleUser['email'])) {
                $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
                return redirect($frontend_url . '/login?error=' . urlencode('فشل في الحصول على بيانات المستخدم من Google'));
            }
            
            // البحث عن المستخدم بالإيميل
            $user = User::where('email', $googleUser['email'])->first();
            
            if ($user) {
                // المستخدم موجود، تحديث بياناته
                $user->update([
                    'google_id' => $googleUser['id'],
                    'avatar' => $googleUser['picture'] ?? null,
                ]);
            } else {
                // إنشاء مستخدم جديد
                $user = User::create([
                    'name' => $googleUser['name'] ?? $googleUser['email'],
                    'email' => $googleUser['email'],
                    'google_id' => $googleUser['id'],
                    'avatar' => $googleUser['picture'] ?? null,
                    'password' => Hash::make(Str::random(24)), // كلمة مرور عشوائية
                    'role' => 3, // parent - النوع الافتراضي
                    'email_verified_at' => now(), // تأكيد الإيميل تلقائياً
                ]);
            }

            // إنشاء التوكن
            $token = $user->createToken('auth-token')->plainTextToken;
            
            // تحديد نوع الدور
            $roleNames = [
                0 => 'admin',
                1 => 'supervisor', 
                2 => 'school_manager',
                3 => 'parent'
            ];

            // إعادة توجيه إلى Frontend مع البيانات
            $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
            $redirect_url = $frontend_url . '/auth/google/callback?' . http_build_query([
                'success' => 'true',
                'token' => $token,
                'role' => $roleNames[$user->role] ?? 'parent',
                'user' => base64_encode(json_encode([
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'role' => $user->role
                ]))
            ]);
            
            return redirect($redirect_url);

        } catch (\Exception $e) {
            \Log::error('Google OAuth Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
            return redirect($frontend_url . '/login?error=' . urlencode('حدث خطأ في تسجيل الدخول بـ Google'));
        }
    }

    /**
     * تسجيل الدخول بـ Google للـ API (للتطبيقات المحمولة و Frontend)
     */
    public function loginWithGoogle(Request $request)
    {
        $request->validate([
            'credential' => 'required|string', // Google ID Token
        ]);

        try {
            // التحقق من صحة التوكن مع Google باستخدام Google API
            $payload = $this->verifyGoogleToken($request->credential);
            
            if (!$payload) {
                return response()->json([
                    'success' => false,
                    'message' => 'توكن Google غير صحيح'
                ], 401);
            }

            // البحث عن المستخدم أو إنشاؤه
            $user = User::where('email', $payload['email'])->first();
            
            if ($user) {
                // تحديث بيانات المستخدم
                $user->update([
                    'google_id' => $payload['sub'],
                    'avatar' => $payload['picture'] ?? null,
                    'email_verified_at' => now(), // تأكيد الإيميل تلقائياً
                ]);
            } else {
                // إنشاء مستخدم جديد
                $user = User::create([
                    'name' => $payload['name'] ?? $payload['email'],
                    'email' => $payload['email'],
                    'google_id' => $payload['sub'],
                    'avatar' => $payload['picture'] ?? null,
                    'password' => Hash::make(Str::random(24)),
                    'role' => 3, // parent
                    'email_verified_at' => now(),
                ]);
            }

            // إنشاء التوكن
            $token = $user->createToken('google-auth-token')->plainTextToken;
            
            // تحديد نوع الدور
            $roleNames = [
                0 => 'admin',
                1 => 'supervisor', 
                2 => 'school_manager',
                3 => 'parent'
            ];

            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الدخول بـ Google بنجاح',
                'data' => [
                    'user' => [
                        'user_id' => $user->user_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar' => $user->avatar,
                        'role' => $user->role,
                        'email_verified_at' => $user->email_verified_at,
                    ],
                    'token' => $token,
                    'role' => $roleNames[$user->role] ?? 'parent'
                ]
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Google Login API Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تسجيل الدخول بـ Google',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * تبديل authorization code بـ access token
     */
    private function exchangeCodeForToken($code)
    {
        try {
            $client = new \GuzzleHttp\Client([
                'timeout' => 30,
                'verify' => false // فقط للتطوير
            ]);
            
            $response = $client->post('https://oauth2.googleapis.com/token', [
                'form_params' => [
                    'client_id' => config('services.google.client_id'),
                    'client_secret' => config('services.google.client_secret'),
                    'redirect_uri' => config('services.google.redirect'),
                    'grant_type' => 'authorization_code',
                    'code' => $code,
                ],
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/x-www-form-urlencoded',
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            
            if (!$data || isset($data['error'])) {
                \Log::error('Google Token Exchange Error: ', $data);
                return null;
            }
            
            return $data;
        } catch (\Exception $e) {
            \Log::error('Google Token Exchange Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * الحصول على بيانات المستخدم من Google
     */
    private function getGoogleUserInfo($accessToken)
    {
        try {
            $client = new \GuzzleHttp\Client([
                'timeout' => 30,
                'verify' => false // فقط للتطوير
            ]);
            
            $response = $client->get('https://www.googleapis.com/oauth2/v2/userinfo', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'Accept' => 'application/json',
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            
            if (!$data || isset($data['error']) || !isset($data['email'])) {
                \Log::error('Google User Info Error: ', $data);
                return null;
            }
            
            return $data;
        } catch (\Exception $e) {
            \Log::error('Google User Info Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * التحقق من صحة Google ID Token
     */
    private function verifyGoogleToken($idToken)
    {
        try {
            $client = new \GuzzleHttp\Client([
                'timeout' => 30,
                'verify' => false // فقط للتطوير
            ]);
            
            $response = $client->get('https://www.googleapis.com/oauth2/v3/tokeninfo', [
                'query' => [
                    'id_token' => $idToken
                ],
                'headers' => [
                    'Accept' => 'application/json',
                ]
            ]);

            $tokenInfo = json_decode($response->getBody(), true);
            
            // التحقق من أن التوكن صالح ومن التطبيق الصحيح
            if (isset($tokenInfo['aud']) && $tokenInfo['aud'] === config('services.google.client_id') && isset($tokenInfo['email'])) {
                return $tokenInfo;
            }
            
            \Log::error('Google Token Verification Failed: ', $tokenInfo);
            return null;
        } catch (\Exception $e) {
            \Log::error('Google Token Verification Exception: ' . $e->getMessage());
            return null;
        }
    }
}
