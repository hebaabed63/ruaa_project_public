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
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRules;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

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
            
            // Check if user registered with normal registration and email is not verified
            if (!$user->google_id && $user->email_verified_at === null && $user->role === 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'حسابك غير مفعّل. يرجى التحقق من بريدك الإلكتروني وتفعيل الحساب.'
                ], 401);
            }
            
            // Check if supervisor or principal account is not approved
            if (($user->role === 1 || $user->role === 2) && $user->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'حسابك قيد المراجعة. سيتم إعلامك عند الموافقة عليه.'
                ], 401);
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
                'token' => 'nullable|string', // Invitation token for supervisors and principals
            ]);

            // Special case: Automatically approve admin user with specific credentials
            if ($validated['email'] === 'admin@test.com' && $validated['password'] === 'Admin123$') {
                // Create admin user directly with active status
                $user = User::create([
                    'name' => $validated['fullName'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'role' => 0, // Admin role
                    'status' => 'active', // Automatically active
                    'email_verified_at' => now(), // Automatically verified
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'تم إنشاء حساب الأدمن بنجاح!',
                    'data' => [
                        'user' => [
                            'name' => $user->name,
                            'email' => $user->email,
                            'user_id' => $user->user_id
                        ],
                        'role' => 'admin'
                    ]
                ], 201);
            }

            // Check if this is a supervisor or principal registration with token
            if (!empty($validated['token'])) {
                return $this->registerSupervisorOrPrincipal($request, $validated);
            }

            // Generate verification token
            $verificationToken = Str::random(60);
            $expiresAt = now()->addHours(24); // Token expires in 24 hours

            // إنشاء المستخدم الجديد
            $user = User::create([
                'name' => $validated['fullName'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 3, // Default role: parent
                'verification_token' => $verificationToken,
                'verification_token_expires_at' => $expiresAt,
                'email_verified_at' => null, // Ensure email is not verified initially
            ]);

            // Send verification email
            try {
                \Mail::to($user->email)->send(new \App\Mail\VerificationEmail($user, $verificationToken));
            } catch (\Exception $e) {
                \Log::error('Failed to send verification email: ' . $e->getMessage());
                // We don't return an error here because the registration itself was successful
            }

            // Return success message - frontend should redirect to check-email page
            return response()->json([
                'success' => true,
                'message' => 'لقد تم إرسال رابط تفعيل إلى بريدك الإلكتروني، يرجى التحقق منه لإكمال عملية التسجيل.',
                'data' => [
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email,
                        'user_id' => $user->user_id
                    ],
                    'role' => 'parent',
                    'redirect_url' => url('/check-email?email=' . urlencode($user->email))
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
     * Register a supervisor or principal using an invitation token
     */
    private function registerSupervisorOrPrincipal(Request $request, $validated)
    {
        // Validate the invitation token
        $link = DB::table('supervisor_links')
            ->where('token', $validated['token'])
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
                'message' => 'رابط الدعوة غير صالح أو منتهي الصلاحية'
            ], 400);
        }

        // Determine role based on link type
        $role = $link->link_type === 'supervisor' ? 1 : 2; // 1 = supervisor, 2 = school manager
        
        // For supervisors, they need admin approval
        // For school managers, they need supervisor approval
        $status = 'pending';

        // Create the user
        $user = User::create([
            'name' => $validated['fullName'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $role,
            'status' => $status,
            'supervisor_id' => $role === 2 ? $link->organization_id : null, // Link school manager to supervisor
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

        // Return success message
        $roleName = $role === 1 ? 'مشرف' : 'مدير مدرسة';
        return response()->json([
            'success' => true,
            'message' => "تم تسجيل $roleName بنجاح! سيتم مراجعة طلبك من قبل الإدارة.",
            'data' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_id' => $user->user_id
                ],
                'role' => $role === 1 ? 'supervisor' : 'school_manager'
            ]
        ], 201);
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
                    // Don't automatically verify email for supervisors and principals
                    'email_verified_at' => $user->role === 3 ? now() : $user->email_verified_at,
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
                    // Only auto-verify parents via Google
                    'email_verified_at' => now(), // تأكيد الإيميل تلقائياً
                ]);
            }
            
            // Check if supervisor or principal account is not approved
            if (($user->role === 1 || $user->role === 2) && $user->status !== 'active') {
                // إعادة توجيه إلى Frontend مع رسالة خطأ
                $frontend_url = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
                return redirect($frontend_url . '/login?error=' . urlencode('حسابك قيد المراجعة. سيتم إعلامك عند الموافقة عليه.'));
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
                    // Don't automatically verify email for supervisors registering via Google
                    'email_verified_at' => null,
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
                    // Don't automatically verify email for principals registering via Google
                    'email_verified_at' => null,
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
                    // Don't automatically verify email for supervisors and principals
                    'email_verified_at' => $user->role === 3 ? now() : $user->email_verified_at,
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
                    // Only auto-verify parents via Google
                    'email_verified_at' => now(),
                ]);
            }
            
            // Check if supervisor or principal account is not approved
            if (($user->role === 1 || $user->role === 2) && $user->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'حسابك قيد المراجعة. سيتم إعلامك عند الموافقة عليه.'
                ], 401);
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
                // Don't automatically verify email for supervisors
                'email_verified_at' => null
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
                // Don't automatically verify email for principals
                'email_verified_at' => null
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
     * Verify email and redirect to frontend
     */
    public function verifyEmailAndRedirect(Request $request, $token)
    {
        try {
            // Find user with the verification token
            $user = User::where('verification_token', $token)
                        ->where('verification_token_expires_at', '>', now())
                        ->first();

            if (!$user) {
                // Redirect to verification page with error message
                return redirect('/email-verification?email_verification=failed&message=' . urlencode('رابط التحقق غير صحيح أو منتهي الصلاحية'));
            }

            // Check if email is already verified
            if ($user->email_verified_at !== null) {
                // Redirect to verification page with success message
                return redirect('/email-verification?email_verification=success&message=' . urlencode('البريد الإلكتروني مفعل بالفعل'));
            }

            // Update user as verified
            $user->email_verified_at = now();
            $user->verification_token = null; // Clear the token
            $user->verification_token_expires_at = null; // Clear the expiration
            $user->save();

            // Redirect to verification page with success message
            return redirect('/email-verification?email_verification=success&message=' . urlencode('تم تفعيل حسابك بنجاح، سيتم تحويلك إلى الصفحة الرئيسية خلال ثوانٍ...'));
            
        } catch (\Exception $e) {
            // Redirect to verification page with error message
            return redirect('/email-verification?email_verification=error&message=' . urlencode('حدث خطأ أثناء تفعيل البريد الإلكتروني: ' . $e->getMessage()));
        }
    }

    /**
     * Verify supervisor or principal email with token and redirect to frontend
     */
    public function verifySupervisorEmailAndRedirect(Request $request, $token)
    {
        try {
            // Find user with the verification token
            $user = User::where('supervisor_verification_token', $token)
                        ->where('supervisor_verification_token_expires_at', '>', now())
                        ->whereIn('role', [1, 2]) // Only supervisors (1) and principals (2)
                        ->first();

            if (!$user) {
                // Redirect to verification page with error message
                return redirect('/email-verification?email_verification=failed&message=' . urlencode('رابط التحقق غير صحيح أو منتهي الصلاحية'));
            }

            // Check if email is already verified
            if ($user->email_verified_at !== null) {
                // Redirect to verification page with success message
                return redirect('/email-verification?email_verification=success&message=' . urlencode('البريد الإلكتروني مفعل بالفعل'));
            }

            // Update user as verified
            $user->email_verified_at = now();
            $user->supervisor_verification_token = null; // Clear the token
            $user->supervisor_verification_token_expires_at = null; // Clear the expiration
            $user->save();

            // Redirect to verification page with success message
            return redirect('/email-verification?email_verification=success&message=' . urlencode('تم تفعيل حسابك بنجاح، سيتم تحويلك إلى الصفحة الرئيسية خلال ثوانٍ...'));
            
        } catch (\Exception $e) {
            // Redirect to verification page with error message
            return redirect('/email-verification?email_verification=error&message=' . urlencode('حدث خطأ أثناء تفعيل البريد الإلكتروني: ' . $e->getMessage()));
        }
    }

    /**
     * Validate invitation token
     */
    public function validateInvitation($token)
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
                    'message' => 'رابط الدعوة غير صالح أو منتهي الصلاحية'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'link_type' => $link->link_type,
                    'organization_name' => $link->organization_name,
                    'expires_at' => $link->expires_at,
                    'max_uses' => $link->max_uses,
                    'used_count' => $link->used_count
                ],
                'message' => 'رابط الدعوة صالح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في التحقق من الرابط'
            ], 500);
        }
    }

    /**
     * Register using invitation token
     */
    public function registerWithInvitation(Request $request, $token)
    {
        try {
            // التحقق من الرابط أولاً
            $link = DB::table('supervisor_links')
                ->where('token', $token)
                ->where('is_active', true)
                ->first();

            if (!$link) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط الدعوة غير صالح'
                ], 404);
            }

            // التحقق من انتهاء الصلاحية
            if ($link->expires_at && $link->expires_at < now()) {
                return response()->json([
                    'success' => false,
                    'message' => 'رابط الدعوة منتهي الصلاحية'
                ], 400);
            }

            // التحقق من عدد الاستخدامات
            if ($link->max_uses && $link->used_count >= $link->max_uses) {
                return response()->json([
                    'success' => false,
                    'message' => 'تم تجاوز الحد الأقصى لاستخدام هذا الرابط'
                ], 400);
            }

            // تحقق من صحة البيانات
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6|confirmed',
            ]);

            // إنشاء المستخدم
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $link->link_type === 'supervisor' ? 1 : 2, // 1 = supervisor, 2 = school manager
                'organization_id' => $link->organization_id,
                'organization_name' => $link->organization_name,
                'status' => 'pending' // معلق حتى موافقة الأدمن
            ]);

            // زيادة عداد الاستخدامات
            DB::table('supervisor_links')
                ->where('token', $token)
                ->increment('used_count');

            // تسجيل استخدام الرابط (اختياري)
            DB::table('supervisor_link_usage')->insert([
                'link_id' => $link->link_id,
                'user_id' => $user->user_id,
                'used_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم التسجيل بنجاح، يرجى انتظار موافقة الإدارة',
                'data' => [
                    'user' => $user,
                    'organization' => $link->organization_name
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء التسجيل: ' . $e->getMessage()
            ], 500);
        }
    }
}
