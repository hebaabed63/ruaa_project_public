<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\School;
use App\Models\SupportTicket;
use App\Models\Setting;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRules;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

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
            
            // التحقق من حالة المستخدم
            // السماح للمشرفين ومديري المدارس بالدخول حتى لو كانوا في حالة انتظار للموافقة
            if ($user->status === 'pending' && $user->role !== 1 && $user->role !== 2) {
                return response()->json([
                    'success' => false,
                    'message' => 'حسابك قيد انتظار موافقة الإدارة. سيتم إعلامك عند الموافقة على حسابك.',
                    'data' => [
                        'status' => 'pending'
                    ]
                ], 403);
            }

            if ($user->status === 'suspended') {
                return response()->json([
                    'success' => false,
                    'message' => 'حسابك موقوف. يرجى التواصل مع الإدارة للمساعدة.',
                    'data' => [
                        'status' => 'suspended'
                    ]
                ], 403);
            }
            
            $token = $user->createToken('auth-token')->plainTextToken;
            
            // تحديد نوع الدور
            $roleNames = [
                0 => 'admin',
                1 => 'supervisor', 
                2 => 'school_manager',
                3 => 'parent'
            ];
            
            // إذا كان المشرف أو مدير المدرسة في حالة انتظار، لا نزال نسمح له بالدخول
            if ($user->status === 'pending' && ($user->role === 1 || $user->role === 2)) {
                return response()->json([
                    'success' => true,
                    'message' => 'حسابك قيد انتظار موافقة الإدارة. يمكنك الوصول إلى لوحة التحكم الخاصة بك.',
                    'data' => [
                        'user' => $user,
                        'token' => $token,
                        'role' => $roleNames[$user->role] ?? 'parent',
                        'status' => 'pending'
                    ]
                ]);
            }
            
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
    public function redirectToGoogle(Request $request)
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

        // Check if this is for registration with a token
        $registrationToken = $request->get('registration_token');
        $role = $request->get('role');

        $params = [
            'client_id' => $client_id,
            'redirect_uri' => $redirect_uri,
            'scope' => 'openid profile email',
            'response_type' => 'code',
            'access_type' => 'offline',
            'prompt' => 'select_account',
            'state' => csrf_token() // إضافة CSRF protection
        ];

        // Add registration token and role to state if provided
        if ($registrationToken && $role) {
            $params['state'] = csrf_token() . '|' . $registrationToken . '|' . $role;
        }

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
            
            // Parse state to check for registration token and role
            $registrationToken = null;
            $role = null;
            if ($state && strpos($state, '|') !== false) {
                $stateParts = explode('|', $state);
                if (count($stateParts) >= 3) {
                    $registrationToken = $stateParts[1];
                    $role = $stateParts[2];
                }
            }
            
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
            
            // If this is a registration with token
            if ($registrationToken && $role) {
                return $this->handleGoogleRegistration($googleUser, $registrationToken, $role, $request);
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
                    'role' => $user->role,
                    'status' => $user->status // إضافة حالة المستخدم
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
     * Handle Google registration with token
     */
    private function handleGoogleRegistration($googleUser, $token, $role, $request)
    {
        try {
            // Validate the token based on role
            if ($role === 'supervisor') {
                $link = DB::table('supervisor_links')
                    ->where('token', $token)
                    ->where('link_type', 'supervisor')
                    ->where('is_active', true)
                    ->where(function($query) {
                        $query->whereNull('expires_at')
                              ->orWhere('expires_at', '>', now());
                    })
                    ->where(function($query) {
                        $query->whereNull('max_uses')
                              ->orWhereRaw('used_count < max_uses');
                    })
                    ->first();

                if (!$link) {
                    $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
                    return redirect($frontend_url . '/register/supervisor/' . $token . '?error=' . urlencode('رابط التسجيل غير صالح أو منتهي الصلاحية'));
                }

                // Create supervisor user
                $user = User::create([
                    'name' => $googleUser['name'] ?? $googleUser['email'],
                    'email' => $googleUser['email'],
                    'google_id' => $googleUser['id'],
                    'avatar' => $googleUser['picture'] ?? null,
                    'password' => Hash::make(Str::random(24)),
                    'role' => 1, // supervisor
                    'status' => 'pending', // needs admin approval
                    'email_verified_at' => now(),
                ]);

                // Update link usage
                DB::table('supervisor_links')
                    ->where('link_id', $link->link_id)
                    ->increment('used_count');

                // Log link usage
                DB::table('supervisor_link_usage')->insert([
                    'link_id' => $link->link_id,
                    'user_id' => $user->user_id,
                    'used_at' => now(),
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent()
                ]);

                // Redirect to success page
                $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
                return redirect($frontend_url . '/register/supervisor/' . $token . '?success=true&message=' . urlencode('تم تسجيل المشرف بنجاح! سيتم مراجعة طلبك من قبل الإدارة.'));
            } 
            else if ($role === 'principal') {
                $link = DB::table('supervisor_links')
                    ->where('token', $token)
                    ->where('link_type', 'principal')
                    ->where('is_active', true)
                    ->where(function($query) {
                        $query->whereNull('expires_at')
                              ->orWhere('expires_at', '>', now());
                    })
                    ->where(function($query) {
                        $query->whereNull('max_uses')
                              ->orWhereRaw('used_count < max_uses');
                    })
                    ->first();

                if (!$link) {
                    $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
                    return redirect($frontend_url . '/register/principal?supervisor_token=' . $token . '&error=' . urlencode('رابط التسجيل غير صالح أو منتهي الصلاحية'));
                }

                // Check if supervisor exists
                $supervisor = User::where('user_id', $link->organization_id)
                                 ->where('role', 1)
                                 ->where('status', 'active')
                                 ->first();

                if (!$supervisor) {
                    $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
                    return redirect($frontend_url . '/register/principal?supervisor_token=' . $token . '&error=' . urlencode('المشرف المرتبط بهذا الرابط غير موجود أو غير مفعل'));
                }

                // Create principal user
                $user = User::create([
                    'name' => $googleUser['name'] ?? $googleUser['email'],
                    'email' => $googleUser['email'],
                    'google_id' => $googleUser['id'],
                    'avatar' => $googleUser['picture'] ?? null,
                    'password' => Hash::make(Str::random(24)),
                    'role' => 2, // school_manager/principal
                    'supervisor_id' => $supervisor->user_id,
                    'status' => 'pending', // needs supervisor approval
                    'email_verified_at' => now(),
                ]);

                // Update link usage
                DB::table('supervisor_links')
                    ->where('link_id', $link->link_id)
                    ->increment('used_count');

                // Log link usage
                DB::table('supervisor_link_usage')->insert([
                    'link_id' => $link->link_id,
                    'user_id' => $user->user_id,
                    'used_at' => now(),
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent()
                ]);

                // Redirect to success page
                $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
                return redirect($frontend_url . '/register/principal?supervisor_token=' . $token . '&success=true&message=' . urlencode('تم تسجيل مدير المدرسة بنجاح! سيتم مراجعة طلبك من قبل المشرف.'));
            }

            // If role is not recognized
            $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
            return redirect($frontend_url . '/login?error=' . urlencode('نوع التسجيل غير مدعوم'));

        } catch (\Exception $e) {
            \Log::error('Google Registration Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
            return redirect($frontend_url . '/login?error=' . urlencode('حدث خطأ في التسجيل باستخدام Google'));
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
                        'status' => $user->status,
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

    // ===========================================
    // Token-based Registration Methods
    // ===========================================

    /**
     * التحقق من صحة رابط التسجيل
     */
    public function validateRegistrationToken($token)
    {
        try {
            $link = DB::table('supervisor_links')
                ->where('token', $token)
                ->where('is_active', true)
                ->where(function($query) {
                    $query->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                })
                ->where(function($query) {
                    $query->whereNull('max_uses')
                          ->orWhereRaw('used_count < max_uses');
                })
                ->first();

            if (!$link) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط التسجيل غير صالح أو منتهي الصلاحية'
                ], 400);
            }

            // Get organization name from user if not directly stored
            $organizationName = $link->organization_name;
            if (!$organizationName && $link->organization_id) {
                $organizationUser = User::find($link->organization_id);
                $organizationName = $organizationUser ? $organizationUser->name : null;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'link_type' => $link->link_type,
                    'organization_id' => $link->organization_id,
                    'organization_name' => $organizationName,
                    'expires_at' => $link->expires_at,
                    'uses_remaining' => $link->max_uses ? ($link->max_uses - $link->used_count) : null
                ],
                'message' => 'رابط التسجيل صالح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في التحقق من الرابط: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تسجيل مشرف جديد
     */
    public function registerSupervisor(Request $request)
    {
        try {
            $validated = $request->validate([
                'fullName' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'phone' => 'nullable|string|max:20',
                'password' => 'required|string|min:6',
                'token' => 'required|string'
            ]);

            // التحقق من صحة التوكن
            $link = DB::table('supervisor_links')
                ->where('token', $validated['token'])
                ->where('link_type', 'supervisor')
                ->where('is_active', true)
                ->where(function($query) {
                    $query->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                })
                ->where(function($query) {
                    $query->whereNull('max_uses')
                          ->orWhereRaw('used_count < max_uses');
                })
                ->first();

            if (!$link) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط التسجيل غير صالح أو منتهي الصلاحية'
                ], 400);
            }

            // إنشاء المستخدم
            $user = User::create([
                'name' => $validated['fullName'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 1, // supervisor
                'phone' => $validated['phone'] ?? null,
                'status' => 'pending', // يحتاج موافقة الأدمين
                'email_verified_at' => now()
            ]);

            // تحديث عداد الاستخدام للرابط
            DB::table('supervisor_links')
                ->where('link_id', $link->link_id)
                ->increment('used_count');

            // تسجيل معلومات الاستخدام
            DB::table('supervisor_link_usage')->insert([
                'link_id' => $link->link_id,
                'user_id' => $user->user_id,
                'used_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل المشرف بنجاح! سيتم مراجعة طلبك من قبل الإدارة.',
                'data' => [
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email,
                        'user_id' => $user->user_id,
                        'status' => 'pending'
                    ],
                    'role' => 'supervisor'
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

    /**
     * تسجيل مدير مدرسة جديد
     */
    public function registerPrincipal(Request $request)
    {
        try {
            $validated = $request->validate([
                'fullName' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'supervisor_token' => 'required|string'
            ]);

            // التحقق من صحة التوكن
            $link = DB::table('supervisor_links')
                ->where('token', $validated['supervisor_token'])
                ->where('link_type', 'principal')
                ->where('is_active', true)
                ->where(function($query) {
                    $query->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                })
                ->where(function($query) {
                    $query->whereNull('max_uses')
                          ->orWhereRaw('used_count < max_uses');
                })
                ->first();

            if (!$link) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط التسجيل غير صالح أو منتهي الصلاحية'
                ], 400);
            }

            // التحقق من وجود المشرف
            $supervisor = User::where('user_id', $link->organization_id)
                             ->where('role', 1)
                             ->where('status', 'active')
                             ->first();

            if (!$supervisor) {
                return response()->json([
                    'success' => false,
                    'message' => 'المشرف المرتبط بهذا الرابط غير موجود أو غير مفعل'
                ], 400);
            }

            // إنشاء المستخدم
            $user = User::create([
                'name' => $validated['fullName'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 2, // school_manager/principal
                'supervisor_id' => $supervisor->user_id,
                'status' => 'pending', // يحتاج موافقة المشرف
                'email_verified_at' => now()
            ]);

            // تحديث عداد الاستخدام للرابط
            DB::table('supervisor_links')
                ->where('link_id', $link->link_id)
                ->increment('used_count');

            // تسجيل معلومات الاستخدام
            DB::table('supervisor_link_usage')->insert([
                'link_id' => $link->link_id,
                'user_id' => $user->user_id,
                'used_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل مدير المدرسة بنجاح! سيتم مراجعة طلبك من قبل المشرف.',
                'data' => [
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email,
                        'user_id' => $user->user_id,
                        'status' => 'pending',
                        'supervisor' => $supervisor->name
                    ],
                    'role' => 'school_manager'
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

    // ===========================================
    // Admin Invitation Management Methods
    // ===========================================

    /**
     * جلب جميع روابط المشرفين
     */
    public function getSupervisorLinks(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            $links = DB::table('supervisor_links')
                ->where('link_type', 'supervisor')
                ->select(
                    'supervisor_links.*'
                )
                ->orderBy('supervisor_links.created_at', 'desc')
                ->get();

            // Process links to ensure only organization_name from supervisor_links table is used
            $processedLinks = $links->map(function ($link) {
                // Only use organization_name from the supervisor_links table
                // This ensures that institution/directorate names are shown, not individual supervisor names
                $link->organization_name = $link->organization_name ?? 'غير محدد';
                return $link;
            });

            return response()->json([
                'success' => true,
                'data' => $processedLinks,
                'message' => 'تم جلب الروابط بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب البيانات: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء رابط دعوة جديد
     */
    public function createSupervisorLink(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بإنشاء روابط الدعوة'
                ], 403);
            }

            $validated = $request->validate([
                'link_type' => 'required|in:supervisor,principal',
                'organization_id' => 'nullable|exists:users,user_id',
                'organization_name' => 'required|string|max:255',
                'expires_at' => 'nullable|date|after:now',
                'max_uses' => 'nullable|integer|min:1'
            ]);

            // إنشاء توكن فريد
            $token = Str::random(32);
            while (DB::table('supervisor_links')->where('token', $token)->exists()) {
                $token = Str::random(32);
            }

            $linkId = DB::table('supervisor_links')->insertGetId([
                'token' => $token,
                'link_type' => $validated['link_type'],
                'organization_id' => $validated['organization_id'] ?? null,
                'organization_name' => $validated['organization_name'],
                'expires_at' => $validated['expires_at'] ?? null,
                'max_uses' => $validated['max_uses'] ?? null,
                'is_active' => true,
                'used_count' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $link = DB::table('supervisor_links')
                ->where('link_id', $linkId)
                ->where('link_type', 'supervisor')
                ->select('supervisor_links.*')
                ->first();

            // Only use organization_name from the supervisor_links table
            // This ensures that institution/directorate names are shown, not individual supervisor names
            $link->organization_name = $link->organization_name ?? 'غير محدد';

            return response()->json([
                'success' => true,
                'data' => $link,
                'message' => 'تم إنشاء رابط الدعوة بنجاح'
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
                'message' => 'حدث خطأ أثناء إنشاء الرابط: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث رابط دعوة
     */
    public function updateSupervisorLink(Request $request, $id)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتحديث روابط الدعوة'
                ], 403);
            }

            $validated = $request->validate([
                'is_active' => 'sometimes|boolean',
                'expires_at' => 'nullable|date|after:now',
                'max_uses' => 'nullable|integer|min:1',
                'organization_name' => 'sometimes|string|max:255'
            ]);

            $updated = DB::table('supervisor_links')
                ->where('link_id', $id)
                ->update(array_merge($validated, ['updated_at' => now()]));

            if (!$updated) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط الدعوة غير موجود'
                ], 404);
            }

            $link = DB::table('supervisor_links')
                ->where('link_id', $id)
                ->where('link_type', 'supervisor')
                ->select('supervisor_links.*')
                ->first();

            // Only use organization_name from the supervisor_links table
            // This ensures that institution/directorate names are shown, not individual supervisor names
            $link->organization_name = $link->organization_name ?? 'غير محدد';

            return response()->json([
                'success' => true,
                'data' => $link,
                'message' => 'تم تحديث رابط الدعوة بنجاح'
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
                'message' => 'حدث خطأ أثناء تحديث الرابط: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف رابط دعوة
     */
    public function deleteSupervisorLink(Request $request, $id)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بحذف روابط الدعوة'
                ], 403);
            }

            $deleted = DB::table('supervisor_links')
                ->where('link_id', $id)
                ->delete();

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط الدعوة غير موجود'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم حذف رابط الدعوة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الرابط: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات روابط المشرفين
     */
    public function getSupervisorLinksStatistics(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            $totalLinks = DB::table('supervisor_links')->count();
            $activeLinks = DB::table('supervisor_links')->where('is_active', true)->count();
            $expiredLinks = DB::table('supervisor_links')
                ->where('expires_at', '<', now())
                ->count();
            $usedLinks = DB::table('supervisor_links')
                ->where('used_count', '>', 0)
                ->count();

            $linksByType = DB::table('supervisor_links')
                ->select('link_type', DB::raw('count(*) as count'))
                ->groupBy('link_type')
                ->get();

            // Get recent registrations
            $recentRegistrations = DB::table('supervisor_link_usage')
                ->join('supervisor_links', 'supervisor_link_usage.link_id', '=', 'supervisor_links.link_id')
                ->join('users', 'supervisor_link_usage.user_id', '=', 'users.user_id')
                ->select(
                    'users.name',
                    'users.email',
                    'supervisor_links.link_type',
                    'supervisor_link_usage.used_at'
                )
                ->orderBy('supervisor_link_usage.used_at', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => [
                        'total_links' => $totalLinks,
                        'active_links' => $activeLinks,
                        'expired_links' => $expiredLinks,
                        'used_links' => $usedLinks
                    ],
                    'links_by_type' => $linksByType,
                    'recent_registrations' => $recentRegistrations
                ],
                'message' => 'تم جلب الإحصائيات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الإحصائيات: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب جميع المستخدمين (للأدمن)
     */
    public function getAllUsers(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            // جلب المستخدمين مع إمكانية التصفية
            $query = User::query();

            // تصفية حسب الدور إذا تم تحديده
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            // تصفية حسب الحالة إذا تم تحديدها
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // ترتيب النتائج
            $users = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $users,
                'message' => 'تم جلب المستخدمين بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المستخدمين: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب المستخدمين المعلقين (للأدمن)
     */
    public function getPendingUsers(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            $pendingUsers = User::where('status', 'pending')->get();

            return response()->json([
                'success' => true,
                'data' => $pendingUsers,
                'message' => 'تم جلب المستخدمين المعلقين بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المستخدمين المعلقين: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * الموافقة على مستخدم معلق (للأدمن)
     */
    public function approvePendingUser(Request $request, $userId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالموافقة على المستخدمين'
                ], 403);
            }

            // البحث عن المستخدم المعلق
            $user = User::where('user_id', $userId)
                ->where('status', 'pending')
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود أو حالته ليست معلق'
                ], 404);
            }

            // تحديث حالة المستخدم إلى نشط
            $user->status = 'active';
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'تمت الموافقة على المستخدم بنجاح',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء الموافقة على المستخدم: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * رفض مستخدم معلق (للأدمن)
     */
    public function rejectPendingUser(Request $request, $userId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك برفض المستخدمين'
                ], 403);
            }

            // البحث عن المستخدم المعلق
            $user = User::where('user_id', $userId)
                ->where('status', 'pending')
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود أو حالته ليست معلق'
                ], 404);
            }

            // تحديث حالة المستخدم إلى مرفوض
            $user->status = 'rejected';
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'تم رفض المستخدم بنجاح',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفض المستخدم: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث حالة المستخدم (للأدمن)
     */
    public function updateUserStatus(Request $request, $userId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتحديث حالة المستخدمين'
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:active,suspended'
            ]);

            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }

            $user->status = $validated['status'];
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة المستخدم بنجاح',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث حالة المستخدم: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * رفض طلب مدير مدرسة معلق
     */
    public function rejectSupervisorPendingPrincipal(Request $request, $userId)
    {
        try {
            // التحقق من أن المستخدم مشرف
            if ($request->user()->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك برفض طلبات مدير المدرسة'
                ], 403);
            }

            // التحقق من أن المستخدم موجود و_pending
            $principal = User::find($userId);
            if (!$principal) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }

            // التحقق من أن المستخدم هو مدير مدرسة
            if ($principal->role !== 2) { // 2 = school_manager
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم ليس من نوع مدير مدرسة'
                ], 404);
            }
            
            // Check if user has correct status
            if ($principal->status != 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'حالة المستخدم ليست معلق. الحالة الحالية: ' . $principal->status
                ], 404);
            }
            
            // Check if user belongs to the supervisor
            if ($principal->supervisor_id != $request->user()->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم لا ينتمي لك كمشرف'
                ], 404);
            }

            // Update user status to rejected
            $principal->status = 'rejected';
            $principal->save();

            return response()->json([
                'success' => true,
                'message' => 'تم رفض طلب مدير المدرسة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفض طلب مدير المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }







    /**
     * إنشاء رابط دعوة مدير مدرسة من قبل المشرف
     */
    public function createSupervisorPrincipalLink(Request $request)
    {
        try {
            // التحقق من أن المستخدم مشرف
            if ($request->user()->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بإنشاء روابط الدعوة'
                ], 403);
            }

            $validated = $request->validate([
                'organization_name' => 'required|string|max:255',
                'expires_at' => 'nullable|date|after:now',
                'max_uses' => 'nullable|integer|min:1'
            ]);

            // إنشاء توكن فريد
            $token = Str::random(32);
            while (DB::table('supervisor_links')->where('token', $token)->exists()) {
                $token = Str::random(32);
            }

            $linkId = DB::table('supervisor_links')->insertGetId([
                'token' => $token,
                'link_type' => 'principal',
                'organization_id' => $request->user()->user_id, // ربط الرابط بالمشرف
                'organization_name' => $validated['organization_name'],
                'expires_at' => $validated['expires_at'] ?? null,
                'max_uses' => $validated['max_uses'] ?? null,
                'is_active' => true,
                'used_count' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $link = DB::table('supervisor_links')
                ->where('link_id', $linkId)
                ->first();

            return response()->json([
                'success' => true,
                'data' => $link,
                'message' => 'تم إنشاء رابط الدعوة بنجاح'
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
                'message' => 'حدث خطأ أثناء إنشاء الرابط: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب روابط الدعوة الخاصة بالمشرف
     */
    public function getSupervisorPrincipalLinks(Request $request)
    {
        try {
            // التحقق من أن المستخدم مشرف
            if ($request->user()->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            $links = DB::table('supervisor_links')
                ->where('organization_id', $request->user()->user_id)
                ->where('link_type', 'principal')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $links,
                'message' => 'تم جلب الروابط بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب البيانات: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث رابط دعوة مدير مدرسة
     */
    public function updateSupervisorPrincipalLink(Request $request, $id)
    {
        try {
            // التحقق من أن المستخدم مشرف
            if ($request->user()->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتحديث روابط الدعوة'
                ], 403);
            }

            // التحقق من وجود الرابط وانتمائه للمشرف
            $link = DB::table('supervisor_links')
                ->where('link_id', $id)
                ->where('organization_id', $request->user()->user_id)
                ->where('link_type', 'principal')
                ->first();

            if (!$link) {
                return response()->json([
                    'success' => false,
                    'message' => 'الرابط غير موجود أو غير مسموح لك بالوصول إليه'
                ], 404);
            }

            $validated = $request->validate([
                'is_active' => 'nullable|boolean',
                'organization_name' => 'sometimes|string|max:255',
                'expires_at' => 'nullable|date|after:now',
                'max_uses' => 'nullable|integer|min:1'
            ]);

            // تحديث الرابط
            DB::table('supervisor_links')
                ->where('link_id', $id)
                ->update([
                    'is_active' => $validated['is_active'] ?? $link->is_active,
                    'organization_name' => $validated['organization_name'] ?? $link->organization_name,
                    'expires_at' => $validated['expires_at'] ?? $link->expires_at,
                    'max_uses' => $validated['max_uses'] ?? $link->max_uses,
                    'updated_at' => now()
                ]);

            // جلب الرابط المحدث
            $updatedLink = DB::table('supervisor_links')
                ->where('link_id', $id)
                ->first();

            return response()->json([
                'success' => true,
                'data' => $updatedLink,
                'message' => 'تم تحديث الرابط بنجاح'
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
                'message' => 'حدث خطأ أثناء تحديث الرابط: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف رابط دعوة مدير مدرسة
     */
    public function deleteSupervisorPrincipalLink(Request $request, $id)
    {
        try {
            // التحقق من أن المستخدم مشرف
            if ($request->user()->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بحذف روابط الدعوة'
                ], 403);
            }

            // التحقق من وجود الرابط وانتمائه للمشرف
            $link = DB::table('supervisor_links')
                ->where('link_id', $id)
                ->where('organization_id', $request->user()->user_id)
                ->where('link_type', 'principal')
                ->first();

            if (!$link) {
                return response()->json([
                    'success' => false,
                    'message' => 'الرابط غير موجود أو غير مسموح لك بالوصول إليه'
                ], 404);
            }

            // حذف الرابط
            DB::table('supervisor_links')
                ->where('link_id', $id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الرابط بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الرابط: ' . $e->getMessage()
            ], 500);
        }
    }

    // ===========================================
    // Supervisor Pending Principals Management Methods
    // ===========================================

    /**
     * جلب مدراء المدارس المعلقين المرتبطين بالمشرف
     */
    public function getSupervisorPendingPrincipals(Request $request)
    {
        try {
            // التحقق من أن المستخدم مشرف
            if ($request->user()->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            // جلب مدراء المدارس المعلقين المرتبطين بالمشرف
            $pendingPrincipals = User::where('role', 2) // school_manager/principal
                ->where('status', 'pending')
                ->where('supervisor_id', $request->user()->user_id)
                ->select('user_id', 'name', 'email', 'phone', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $pendingPrincipals,
                'message' => 'تم جلب طلبات مدراء المدارس المعلقة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب البيانات: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * الموافقة على طلب مدير مدرسة معلق
     */
    public function approveSupervisorPendingPrincipal(Request $request, $userId)
    {
        try {
            // التحقق من أن المستخدم مشرف
            if ($request->user()->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالموافقة على طلبات مدراء المدارس'
                ], 403);
            }

            // التحقق من وجود المستخدم وانتمائه للمشرف
            $principal = User::where('user_id', $userId)
                ->where('role', 2) // school_manager/principal
                ->where('status', 'pending')
                ->where('supervisor_id', $request->user()->user_id)
                ->first();

            // If not found, check what went wrong for better debugging
            if (!$principal) {
                // Check if user exists at all
                $user = User::where('user_id', $userId)->first();
                
                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'المستخدم غير موجود في النظام'
                    ], 404);
                }
                
                // Check if user has correct role
                if ($user->role != 2) {
                    return response()->json([
                        'success' => false,
                        'message' => 'المستخدم ليس من نوع مدير مدرسة'
                    ], 404);
                }
                
                // Check if user has correct status
                if ($user->status != 'pending') {
                    return response()->json([
                        'success' => false,
                        'message' => 'حالة المستخدم ليست معلق. الحالة الحالية: ' . $user->status
                    ], 404);
                }
                
                // Check if user belongs to this supervisor
                if ($user->supervisor_id != $request->user()->user_id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'المستخدم غير مرتبط بهذا المشرف'
                    ], 404);
                }
                
                // If we get here, there's an unexpected issue
                return response()->json([
                    'success' => false,
                    'message' => 'طلب مدير المدرسة غير موجود أو غير مسموح لك بالوصول إليه'
                ], 404);
            }

            // تحديث حالة المستخدم إلى نشط
            $principal->update([
                'status' => 'active',
                'updated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تمت الموافقة على طلب مدير المدرسة بنجاح',
                'data' => [
                    'user' => [
                        'name' => $principal->name,
                        'email' => $principal->email,
                        'status' => 'active'
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الموافقة على طلب مدير المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب إحصائيات لوحة التحكم للإدارة
     */
    public function getDashboardStatistics(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            // إحصائيات المستخدمين
            $totalUsers = User::count();
            $activeUsers = User::where('status', 'active')->count();
            $pendingUsers = User::where('status', 'pending')->count();
            
            // إحصائيات المدارس
            $totalSchools = School::count();
            
            // إحصائيات الروابط
            $totalLinks = DB::table('supervisor_links')->count();
            $activeLinks = DB::table('supervisor_links')->where('is_active', true)->count();
            
            // إحصائيات التذاكر (مثال)
            $supportTickets = SupportTicket::count(); // جلب تذاكر الدعم الفعلية
            
            // أحدث التسجيلات
            $recentRegistrations = DB::table('supervisor_link_usage')
                ->join('supervisor_links', 'supervisor_link_usage.link_id', '=', 'supervisor_links.link_id')
                ->join('users', 'supervisor_link_usage.user_id', '=', 'users.user_id')
                ->select(
                    'users.name',
                    'users.email',
                    'supervisor_links.link_type',
                    'supervisor_link_usage.used_at'
                )
                ->orderBy('supervisor_link_usage.used_at', 'desc')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => [
                        'total_users' => $totalUsers,
                        'active_users' => $activeUsers,
                        'pending_users' => $pendingUsers,
                        'total_schools' => $totalSchools,
                        'total_links' => $totalLinks,
                        'active_links' => $activeLinks,
                        'support_tickets' => $supportTickets
                    ],
                    'recent_registrations' => $recentRegistrations
                ],
                'message' => 'تم جلب الإحصائيات بنجاح'
            ]);

        } catch (\Exception $e) {
            \Log::error('Dashboard Statistics Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الإحصائيات: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب جميع تذاكر الدعم (للأدمن)
     */
    public function getAllSupportTickets(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            $tickets = SupportTicket::with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($ticket) {
                    return [
                        'ticket_id' => $ticket->ticket_id,
                        'title' => $ticket->title,
                        'user_name' => $ticket->user->name,
                        'user_email' => $ticket->user->email,
                        'priority' => $ticket->priority,
                        'status' => $ticket->status,
                        'created_at' => $ticket->created_at,
                        'updated_at' => $ticket->updated_at
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $tickets,
                'message' => 'تم جلب تذاكر الدعم بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تذاكر الدعم: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب تذكرة دعم محددة (للأدمن)
     */
    public function getSupportTicketById(Request $request, $ticketId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            $ticket = SupportTicket::with('user')
                ->where('ticket_id', $ticketId)
                ->first();

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'التذكرة غير موجودة'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'ticket_id' => $ticket->ticket_id,
                    'title' => $ticket->title,
                    'description' => $ticket->description,
                    'user_name' => $ticket->user->name,
                    'user_email' => $ticket->user->email,
                    'priority' => $ticket->priority,
                    'status' => $ticket->status,
                    'attachment_url' => $ticket->attachment_url,
                    'created_at' => $ticket->created_at,
                    'updated_at' => $ticket->updated_at
                ],
                'message' => 'تم جلب تفاصيل التذكرة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تفاصيل التذكرة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث حالة تذكرة الدعم (للأدمن)
     */
    public function updateSupportTicketStatus(Request $request, $ticketId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتحديث حالة تذاكر الدعم'
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:open,in_progress,resolved,closed'
            ]);

            $ticket = SupportTicket::find($ticketId);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'التذكرة غير موجودة'
                ], 404);
            }

            $ticket->status = $validated['status'];
            $ticket->save();

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة التذكرة بنجاح',
                'data' => $ticket
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث حالة التذكرة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف تذكرة دعم (للأدمن)
     */
    public function deleteSupportTicket(Request $request, $ticketId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بحذف تذاكر الدعم'
                ], 403);
            }

            $ticket = SupportTicket::find($ticketId);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'التذكرة غير موجودة'
                ], 404);
            }

            $ticket->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف التذكرة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف التذكرة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system settings (for admin)
     */
    public function getSystemSettings(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            // Get settings from database
            $settings = Setting::all()->keyBy('key')->map(function ($setting) {
                // Convert value based on type
                switch ($setting->type) {
                    case 'boolean':
                        return (bool) $setting->value;
                    case 'integer':
                        return (int) $setting->value;
                    case 'json':
                        return json_decode($setting->value, true);
                    default:
                        return $setting->value;
                }
            });

            // Convert to the format expected by the frontend
            $formattedSettings = [
                'site_name' => $settings['site_name'] ?? 'منصة رؤى التعليمية',
                'site_description' => $settings['site_description'] ?? 'منصة شاملة لإدارة المدارس والطلاب والمعلمين',
                'contact_email' => $settings['contact_email'] ?? 'support@ruaa.edu.sa',
                'contact_phone' => $settings['contact_phone'] ?? '+966 11 123 4567',
                'smtp_host' => $settings['smtp_host'] ?? 'smtp.gmail.com',
                'smtp_port' => $settings['smtp_port'] ?? '587',
                'smtp_username' => $settings['smtp_username'] ?? 'noreply@ruaa.edu.sa',
                'smtp_encryption' => $settings['smtp_encryption'] ?? 'tls',
                'email_notifications' => $settings['email_notifications'] ?? true,
                'sms_notifications' => $settings['sms_notifications'] ?? false,
                'push_notifications' => $settings['push_notifications'] ?? true,
                'password_min_length' => $settings['password_min_length'] ?? 8,
                'password_require_numbers' => $settings['password_require_numbers'] ?? true,
                'password_require_special_chars' => $settings['password_require_special_chars'] ?? true,
                'session_timeout' => $settings['session_timeout'] ?? 30,
                'theme' => $settings['theme'] ?? 'light',
                'language' => $settings['language'] ?? 'ar',
                'date_format' => $settings['date_format'] ?? 'DD/MM/YYYY',
                'time_format' => $settings['time_format'] ?? '24h',
                'maintenance_mode' => $settings['maintenance_mode'] ?? false,
                'maintenance_message' => $settings['maintenance_message'] ?? 'النظام قيد الصيانة، يرجى المحاولة لاحقاً'
            ];

            return response()->json([
                'success' => true,
                'data' => $formattedSettings,
                'message' => 'تم جلب إعدادات النظام بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب إعدادات النظام: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update system settings (for admin)
     */
    public function updateSystemSettings(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتحديث إعدادات النظام'
                ], 403);
            }

            // Validate input
            $validated = $request->validate([
                'site_name' => 'required|string|max:255',
                'site_description' => 'nullable|string',
                'contact_email' => 'required|email|max:255',
                'contact_phone' => 'nullable|string|max:20',
                'smtp_host' => 'nullable|string|max:255',
                'smtp_port' => 'nullable|string|max:5',
                'smtp_username' => 'nullable|email|max:255',
                'smtp_password' => 'nullable|string|max:255',
                'smtp_encryption' => 'nullable|in:tls,ssl,none',
                'email_notifications' => 'boolean',
                'sms_notifications' => 'boolean',
                'push_notifications' => 'boolean',
                'password_min_length' => 'required|integer|min:6|max:128',
                'password_require_numbers' => 'boolean',
                'password_require_special_chars' => 'boolean',
                'session_timeout' => 'required|integer|min:5|max:1440',
                'theme' => 'required|in:light,dark',
                'language' => 'required|in:ar,en',
                'date_format' => 'required|string|max:20',
                'time_format' => 'required|in:12h,24h',
                'maintenance_mode' => 'boolean',
                'maintenance_message' => 'nullable|string|max:500'
            ]);

            // Update settings in database
            foreach ($validated as $key => $value) {
                // Skip password field if empty
                if ($key === 'smtp_password' && empty($value)) {
                    continue;
                }
                
                // Determine the type of the setting
                $type = 'string';
                if (in_array($key, ['email_notifications', 'sms_notifications', 'push_notifications', 'password_require_numbers', 'password_require_special_chars', 'maintenance_mode'])) {
                    $type = 'boolean';
                } elseif (in_array($key, ['password_min_length', 'session_timeout'])) {
                    $type = 'integer';
                }
                
                // Update or create the setting
                Setting::updateOrCreate(
                    ['key' => $key],
                    [
                        'value' => $value,
                        'type' => $type,
                        'group' => $this->getSettingGroup($key)
                    ]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث إعدادات النظام بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث إعدادات النظام: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get setting group based on key
     */
    private function getSettingGroup($key)
    {
        $groups = [
            'general' => ['site_name', 'site_description', 'contact_email', 'contact_phone'],
            'email' => ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_encryption'],
            'notifications' => ['email_notifications', 'sms_notifications', 'push_notifications'],
            'security' => ['password_min_length', 'password_require_numbers', 'password_require_special_chars', 'session_timeout'],
            'appearance' => ['theme', 'language', 'date_format', 'time_format'],
            'maintenance' => ['maintenance_mode', 'maintenance_message']
        ];
        
        foreach ($groups as $group => $keys) {
            if (in_array($key, $keys)) {
                return $group;
            }
        }
        
        return 'general';
    }

    /**
     * Get all complaints (for admin)
     */
    public function getAllComplaints(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لشكاوي المستخدمين'
                ], 403);
            }

            $complaints = Complaint::with('user')->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $complaints,
                'message' => 'تم جلب الشكاوي بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الشكاوي: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get complaint by ID (for admin)
     */
    public function getComplaintById(Request $request, $complaintId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه الشكوى'
                ], 403);
            }

            $complaint = Complaint::with('user')->find($complaintId);

            if (!$complaint) {
                return response()->json([
                    'success' => false,
                    'message' => 'الشكوى غير موجودة'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $complaint,
                'message' => 'تم جلب الشكوى بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الشكوى: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update complaint status (for admin)
     */
    public function updateComplaintStatus(Request $request, $complaintId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتحديث حالة الشكوى'
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:open,in_progress,resolved,closed'
            ]);

            $complaint = Complaint::find($complaintId);

            if (!$complaint) {
                return response()->json([
                    'success' => false,
                    'message' => 'الشكوى غير موجودة'
                ], 404);
            }

            $complaint->status = $validated['status'];
            $complaint->save();

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة الشكوى بنجاح',
                'data' => $complaint
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
                'message' => 'حدث خطأ أثناء تحديث حالة الشكوى: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete complaint (for admin)
     */
    public function deleteComplaint(Request $request, $complaintId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بحذف الشكوى'
                ], 403);
            }

            $complaint = Complaint::find($complaintId);

            if (!$complaint) {
                return response()->json([
                    'success' => false,
                    'message' => 'الشكوى غير موجودة'
                ], 404);
            }

            $complaint->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الشكوى بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الشكوى: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create complaint (for users)
     */
    public function createComplaint(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'complaint_type' => 'required|in:technical,service,other'
            ]);

            $complaint = Complaint::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'user_id' => $request->user()->user_id,
                'complaint_type' => $validated['complaint_type'],
                'status' => 'open',
                'priority' => 'medium'
            ]);

            // Load the user relationship
            $complaint->load('user');

            return response()->json([
                'success' => true,
                'message' => 'تم إرسال الشكوى بنجاح',
                'data' => $complaint
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
                'message' => 'حدث خطأ أثناء إرسال الشكوى: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get reports schools data (for admin)
     */
    public function getReportsSchools(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            // Get query parameters for filtering
            $region = $request->query('region');
            $schoolType = $request->query('school_type');
            $supervisorId = $request->query('supervisor_id');
            $dateRange = $request->query('date_range');

            // Build query for schools with their evaluations
            $schoolsQuery = School::with(['evaluations' => function($query) {
                $query->with('criteria');
            }, 'supervisor']);

            // Apply filters
            if ($region) {
                $schoolsQuery->where('region', $region);
            }
            
            if ($schoolType) {
                $schoolsQuery->where('type', $schoolType);
            }
            
            if ($supervisorId) {
                $schoolsQuery->where('supervisor_id', $supervisorId);
            }
            
            if ($dateRange) {
                $startDate = null;
                $endDate = now();
                
                switch ($dateRange) {
                    case 'week':
                        $startDate = now()->subWeek();
                        break;
                    case 'month':
                        $startDate = now()->subMonth();
                        break;
                    case 'quarter':
                        $startDate = now()->subQuarter();
                        break;
                    case 'year':
                        $startDate = now()->subYear();
                        break;
                }
                
                if ($startDate) {
                    $schoolsQuery->whereHas('evaluations', function($query) use ($startDate, $endDate) {
                        $query->whereBetween('created_at', [$startDate, $endDate]);
                    });
                }
            }

            // Get schools with their data
            $schools = $schoolsQuery->get();

            // Process schools data for the report
            $reportData = $schools->map(function($school) {
                $evaluations = $school->evaluations;
                $totalEvaluations = $evaluations->count();
                
                // Calculate average rating
                $averageRating = $totalEvaluations > 0 ? 
                    $evaluations->avg('overall_rating') : 0;
                
                return [
                    'school_id' => $school->school_id,
                    'school_name' => $school->name,
                    'average_rating' => round($averageRating, 2),
                    'evaluations_count' => $totalEvaluations,
                    'supervisor_name' => $school->supervisor ? $school->supervisor->name : 'غير محدد',
                    'region' => $school->region,
                    'status' => $school->status,
                    'school_type' => $school->type
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $reportData,
                'message' => 'تم جلب بيانات المدارس بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات المدارس: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get reports summary data (for admin)
     */
    public function getReportsSummary(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            // Get query parameters for filtering
            $region = $request->query('region');
            $schoolType = $request->query('school_type');
            $supervisorId = $request->query('supervisor_id');
            $dateRange = $request->query('date_range');

            // Build base queries
            $schoolsQuery = School::query();
            $evaluationsQuery = Evaluation::query();
            $supervisorsQuery = User::where('role', 1)->where('status', 'active');
            $parentsQuery = User::where('role', 3)->where('status', 'active');

            // Apply filters to schools
            if ($region) {
                $schoolsQuery->where('region', $region);
                $evaluationsQuery->whereHas('school', function($query) use ($region) {
                    $query->where('region', $region);
                });
            }
            
            if ($schoolType) {
                $schoolsQuery->where('type', $schoolType);
                $evaluationsQuery->whereHas('school', function($query) use ($schoolType) {
                    $query->where('type', $schoolType);
                });
            }
            
            if ($supervisorId) {
                $schoolsQuery->where('supervisor_id', $supervisorId);
                $evaluationsQuery->whereHas('school', function($query) use ($supervisorId) {
                    $query->where('supervisor_id', $supervisorId);
                });
            }
            
            if ($dateRange) {
                $startDate = null;
                $endDate = now();
                
                switch ($dateRange) {
                    case 'week':
                        $startDate = now()->subWeek();
                        break;
                    case 'month':
                        $startDate = now()->subMonth();
                        break;
                    case 'quarter':
                        $startDate = now()->subQuarter();
                        break;
                    case 'year':
                        $startDate = now()->subYear();
                        break;
                }
                
                if ($startDate) {
                    $schoolsQuery->where('created_at', '>=', $startDate);
                    $evaluationsQuery->whereBetween('created_at', [$startDate, $endDate]);
                    $supervisorsQuery->where('created_at', '>=', $startDate);
                    $parentsQuery->where('created_at', '>=', $startDate);
                }
            }

            // Get summary data
            $totalSchools = $schoolsQuery->count();
            $totalEvaluations = $evaluationsQuery->count();
            
            // Calculate average rating
            $averageRating = $totalEvaluations > 0 ? 
                round($evaluationsQuery->avg('overall_rating'), 2) : 0;
            
            $activeSupervisors = $supervisorsQuery->count();
            $activeParents = $parentsQuery->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_schools' => $totalSchools,
                    'total_evaluations' => $totalEvaluations,
                    'average_rating' => $averageRating,
                    'active_supervisors' => $activeSupervisors,
                    'active_parents' => $activeParents
                ],
                'message' => 'تم جلب ملخص التقارير بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب ملخص التقارير: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get reports comparison data (for admin)
     */
    public function getReportsComparison(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            // Get query parameters for filtering
            $region = $request->query('region');
            $schoolType = $request->query('school_type');
            $supervisorId = $request->query('supervisor_id');
            $dateRange = $request->query('date_range');

            // Build query for top 5 schools by average rating
            $schoolsQuery = School::withCount('evaluations')
                ->withAvg('evaluations', 'overall_rating')
                ->having('evaluations_count', '>', 0)
                ->orderBy('evaluations_avg_overall_rating', 'desc')
                ->limit(5);

            // Apply filters
            if ($region) {
                $schoolsQuery->where('region', $region);
            }
            
            if ($schoolType) {
                $schoolsQuery->where('type', $schoolType);
            }
            
            if ($supervisorId) {
                $schoolsQuery->where('supervisor_id', $supervisorId);
            }
            
            if ($dateRange) {
                $startDate = null;
                $endDate = now();
                
                switch ($dateRange) {
                    case 'week':
                        $startDate = now()->subWeek();
                        break;
                    case 'month':
                        $startDate = now()->subMonth();
                        break;
                    case 'quarter':
                        $startDate = now()->subQuarter();
                        break;
                    case 'year':
                        $startDate = now()->subYear();
                        break;
                }
                
                if ($startDate) {
                    $schoolsQuery->whereHas('evaluations', function($query) use ($startDate, $endDate) {
                        $query->whereBetween('created_at', [$startDate, $endDate]);
                    });
                }
            }

            // Get top 5 schools
            $topSchools = $schoolsQuery->get();

            // Prepare data for charts
            $schoolNames = $topSchools->pluck('name')->toArray();
            $averageRatings = $topSchools->pluck('evaluations_avg_overall_rating')->map(function($rating) {
                return round($rating, 2);
            })->toArray();

            // Get school type distribution
            $schoolTypesQuery = School::query();
            
            if ($region) {
                $schoolTypesQuery->where('region', $region);
            }
            
            if ($supervisorId) {
                $schoolTypesQuery->where('supervisor_id', $supervisorId);
            }
            
            $schoolTypeDistribution = $schoolTypesQuery->select('type')
                ->selectRaw('count(*) as count')
                ->groupBy('type')
                ->get()
                ->mapWithKeys(function($item) {
                    return [$item->type => $item->count];
                });

            // Get performance over time (last 12 months)
            $performanceOverTime = [];
            $evaluationsQuery = Evaluation::query();
            
            if ($region) {
                $evaluationsQuery->whereHas('school', function($query) use ($region) {
                    $query->where('region', $region);
                });
            }
            
            if ($schoolType) {
                $evaluationsQuery->whereHas('school', function($query) use ($schoolType) {
                    $query->where('type', $schoolType);
                });
            }
            
            if ($supervisorId) {
                $evaluationsQuery->whereHas('school', function($query) use ($supervisorId) {
                    $query->where('supervisor_id', $supervisorId);
                });
            }
            
            // Get monthly averages for the last 12 months
            for ($i = 11; $i >= 0; $i--) {
                $startOfMonth = now()->subMonths($i)->startOfMonth();
                $endOfMonth = now()->subMonths($i)->endOfMonth();
                
                $monthlyAvg = $evaluationsQuery
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->avg('overall_rating') ?? 0;
                
                $performanceOverTime[] = [
                    'month' => $startOfMonth->format('M Y'),
                    'average_rating' => round($monthlyAvg, 2)
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'top_schools' => [
                        'names' => $schoolNames,
                        'ratings' => $averageRatings
                    ],
                    'school_type_distribution' => $schoolTypeDistribution,
                    'performance_over_time' => $performanceOverTime
                ],
                'message' => 'تم جلب بيانات المقارنات بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات المقارنات: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export report (for admin)
     */
    public function exportReport(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتصدير التقارير'
                ], 403);
            }

            $validated = $request->validate([
                'export_type' => 'required|in:pdf,excel',
                'report_data' => 'required|array'
            ]);

            // For now, we'll just return a success response
            // In a real implementation, you would generate the actual PDF or Excel file
            return response()->json([
                'success' => true,
                'message' => 'تم تصدير التقرير بنجاح',
                'data' => [
                    'export_type' => $validated['export_type'],
                    'file_url' => 'http://example.com/report.' . $validated['export_type']
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
                'message' => 'حدث خطأ أثناء تصدير التقرير: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get detailed school report (for admin)
     */
    public function getSchoolReport(Request $request, $schoolId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            // Get school with evaluations and criteria
            $school = School::with(['evaluations.criteria', 'supervisor'])
                ->find($schoolId);

            if (!$school) {
                return response()->json([
                    'success' => false,
                    'message' => 'المدرسة غير موجودة'
                ], 404);
            }

            // Process evaluation data
            $evaluations = $school->evaluations;
            $totalEvaluations = $evaluations->count();
            
            // Calculate average rating
            $averageRating = $totalEvaluations > 0 ? 
                round($evaluations->avg('overall_rating'), 2) : 0;

            // Calculate criteria averages
            $criteriaAverages = [];
            if ($totalEvaluations > 0) {
                // Group evaluation criteria by criteria name
                $criteriaGroups = [];
                
                foreach ($evaluations as $evaluation) {
                    foreach ($evaluation->criteria as $criterion) {
                        $criteriaName = $criterion->name;
                        if (!isset($criteriaGroups[$criteriaName])) {
                            $criteriaGroups[$criteriaName] = [];
                        }
                        $criteriaGroups[$criteriaName][] = $criterion->pivot->score;
                    }
                }
                
                // Calculate average for each criteria
                foreach ($criteriaGroups as $name => $scores) {
                    $criteriaAverages[$name] = round(array_sum($scores) / count($scores), 2);
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'school' => [
                        'id' => $school->school_id,
                        'name' => $school->name,
                        'region' => $school->region,
                        'type' => $school->type,
                        'status' => $school->status,
                        'supervisor_name' => $school->supervisor ? $school->supervisor->name : 'غير محدد'
                    ],
                    'statistics' => [
                        'total_evaluations' => $totalEvaluations,
                        'average_rating' => $averageRating,
                        'criteria_averages' => $criteriaAverages
                    ]
                ],
                'message' => 'تم جلب تقرير المدرسة بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تقرير المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Validate invitation token
     */
    public function validateInvitationToken($token)
    {
        try {
            // البحث عن الرابط
            $link = DB::table('invitation_links')
                ->where('token', $token)
                ->first();
            
            if (!$link) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط الدعوة غير صحيح'
                ], 404);
            }
            
            // التحقق من أن الرابط نشط
            if (!$link->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط الدعوة غير نشط'
                ], 400);
            }
            
            // التحقق من تاريخ الانتهاء
            if ($link->expires_at && now() > $link->expires_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط الدعوة منتهي الصلاحية'
                ], 400);
            }
            
            // التحقق من عدد الاستخدامات
            if ($link->max_uses && $link->uses_count >= $link->max_uses) {
                return response()->json([
                    'success' => false,
                    'message' => 'تم استخدام رابط الدعوة الحد الأقصى من المرات'
                ], 400);
            }
            
            // جلب معلومات المشرف/المسؤول عن الرابط
            $creator = DB::table('users')
                ->where('user_id', $link->created_by)
                ->select('user_id', 'name', 'email')
                ->first();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'link_type' => $link->link_type,
                    'organization_name' => $link->organization_name,
                    'organization_id' => $link->organization_id,
                    'supervisor' => [
                        'id' => $creator->user_id,
                        'name' => $creator->name,
                        'email' => $creator->email
                    ]
                ],
                'message' => 'رابط الدعوة صالح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في التحقق من الرابط: ' . $e->getMessage()
            ], 500);
        }
    }
}
