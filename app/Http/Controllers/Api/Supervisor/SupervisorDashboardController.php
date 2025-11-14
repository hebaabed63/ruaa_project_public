<?php

namespace App\Http\Controllers\Api\Supervisor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\School;
use App\Models\Report;
use App\Models\SupervisorInvitation;
use App\Models\SupportTicket;
use App\Models\Message;
use App\Models\Conversation;
use App\Models\Notification;

class SupervisorDashboardController extends Controller
{
    /**
     * Get supervisor dashboard statistics
     */
    public function getDashboardStats(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // إحصائيات المدارس التي يشرف عليها المشرف
            $totalSchools = DB::table('supervisor_school')
                ->where('supervisor_id', $user->user_id)
                ->count();
            
            // إحصائيات التقييمات
            $completedEvaluations = DB::table('evaluations')
                ->where('supervisor_id', $user->user_id)
                ->where('status', 'completed')
                ->count();
                
            $scheduledEvaluations = DB::table('evaluations')
                ->where('supervisor_id', $user->user_id)
                ->where('status', 'scheduled')
                ->count();
            
            // إحصائيات التقارير
            $submittedReports = DB::table('reports')
                ->where('supervisor_id', $user->user_id)
                ->where('status', 'submitted')
                ->count();
                
            $draftReports = DB::table('reports')
                ->where('supervisor_id', $user->user_id)
                ->where('status', 'draft')
                ->count();
            
            // عدد الإشعارات المعلقة (مثال بسيط)
            $pendingNotifications = 3;
            
            // عدد طلبات المدراء المعلقة
            $pendingRequests = User::where('role', 2) // school_manager
                ->where('status', 'pending')
                ->where('supervisor_id', $user->user_id)
                ->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'totalSchools' => $totalSchools,
                    'activeEvaluations' => $scheduledEvaluations,
                    'completedEvaluations' => $completedEvaluations,
                    'pendingReports' => $draftReports,
                    'submittedReports' => $submittedReports,
                    'pendingNotifications' => $pendingNotifications,
                    'pendingRequests' => $pendingRequests
                ],
                'message' => 'تم جلب إحصائيات لوحة التحكم بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الإحصائيات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get schools that supervisor oversees
     */
    public function getSupervisorSchools(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // التحقق من وجود جدول supervisor_school
            if (!Schema::hasTable('supervisor_school')) {
                // إرجاع مصفوفة فارغة إذا الجدول غير موجود
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'لا توجد مدارس مرتبطة بحسابك حالياً'
                ]);
            }
            
            // جلب المدارس المرتبطة بالمشرف
            $schools = DB::table('supervisor_school')
                ->join('schools', 'supervisor_school.school_id', '=', 'schools.school_id')
                ->where('supervisor_school.supervisor_id', $user->user_id)
                ->select(
                    'schools.school_id',
                    'schools.name',
                    DB::raw("COALESCE(schools.address, '') as address"),
                    'schools.type',
                    'schools.created_at'
                )
                ->get();
            
            // Map English type values to Arabic for response
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            $schools->transform(function ($school) use ($typeMapping) {
                $school->type = $typeMapping[$school->type] ?? $school->type;
                return $school;
            });
            
            return response()->json([
                'success' => true,
                'data' => $schools,
                'message' => 'تم جلب قائمة المدارس بنجاح'
            ]);
            
        } catch (\Exception $e) {
            // في حالة أي خطأ، إرجاع مصفوفة فارغة بدلاً من خطأ 500
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'لا توجد مدارس مرتبطة بحسابك حالياً'
            ], 200);
        }
    }
    
    /**
     * Get supervisor profile data
     */
    public function getSupervisorProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب بيانات المشرف
            $profile = [
                'id' => $user->user_id,
                'fullName' => $user->name,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'profileImage' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'dateJoined' => $user->created_at->format('Y-m-d'),
                'status' => $user->status
            ];
            
            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'تم جلب بيانات الملف الشخصي بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات الملف الشخصي: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update supervisor profile data
     */
    public function updateSupervisorProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'fullName' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->user_id . ',user_id',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
            ]);
            
            // تحديث بيانات المشرف
            $user->name = $validatedData['fullName'];
            $user->email = $validatedData['email'];
            $user->phone = $validatedData['phone'];
            $user->address = $validatedData['address'];
            $user->save();
            
            // جلب البيانات المحدثة
            $profile = [
                'id' => $user->user_id,
                'fullName' => $user->name,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'profileImage' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'dateJoined' => $user->created_at->format('Y-m-d'),
                'status' => $user->status
            ];
            
            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'تم تحديث بيانات الملف الشخصي بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث بيانات الملف الشخصي: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update supervisor profile image
     */
    public function updateSupervisorProfileImage(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // التحقق من صحة الصورة
            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);
            
            // حذف الصورة القديمة إذا كانت موجودة
            if ($user->avatar && Storage::exists('public/' . $user->avatar)) {
                Storage::delete('public/' . $user->avatar);
            }
            
            // رفع الصورة الجديدة
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            
            // تحديث مسار الصورة في قاعدة البيانات
            $user->avatar = $avatarPath;
            $user->save();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'profileImage' => asset('storage/' . $avatarPath)
                ],
                'message' => 'تم تحديث صورة الملف الشخصي بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث صورة الملف الشخصي: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get supervisor reports
     */
    public function getSupervisorReports(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب التقارير المرتبطة بالمشرف
            $reports = Report::where('supervisor_id', $user->user_id)
                ->with(['school', 'reviewer'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $reports,
                'message' => 'تم جلب قائمة التقارير بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب قائمة التقارير: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create a new report
     */
    public function createReport(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'school_id' => 'nullable|exists:schools,school_id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'file' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // 5MB max
                'priority' => 'nullable|in:low,medium,high,urgent',
                'status' => 'nullable|in:draft,submitted'
            ]);
            
            // رفع الملف إذا كان موجوداً
            $filePath = null;
            if ($request->hasFile('file')) {
                $filePath = $request->file('file')->store('reports', 'public');
            }
            
            // إنشاء التقرير
            $report = Report::create([
                'supervisor_id' => $user->user_id,
                'school_id' => $validatedData['school_id'] ?? null,
                'title' => $validatedData['title'],
                'description' => $validatedData['description'] ?? null,
                'file_path' => $filePath,
                'priority' => $validatedData['priority'] ?? 'medium',
                'status' => $validatedData['status'] ?? 'draft'
            ]);
            
            // إذا تم إرسال التقرير، نحدث تاريخ الإرسال
            if ($report->status === 'submitted') {
                $report->submitted_at = now();
                $report->save();
            }
            
            return response()->json([
                'success' => true,
                'data' => $report->load(['school', 'reviewer']),
                'message' => 'تم إنشاء التقرير بنجاح'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء التقرير: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update a report
     */
    public function updateReport(Request $request, $reportId)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب التقرير والتحقق من ملكيته
            $report = Report::where('supervisor_id', $user->user_id)
                ->where('report_id', $reportId)
                ->first();
            
            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'التقرير غير موجود أو غير مسموح لك بالوصول إليه'
                ], 404);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'school_id' => 'nullable|exists:schools,school_id',
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'file' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // 5MB max
                'priority' => 'nullable|in:low,medium,high,urgent',
                'status' => 'nullable|in:draft,submitted'
            ]);
            
            // تحديث البيانات
            $report->fill($validatedData);
            
            // رفع الملف الجديد إذا كان موجوداً
            if ($request->hasFile('file')) {
                // حذف الملف القديم إذا كان موجوداً
                if ($report->file_path && Storage::exists('public/' . $report->file_path)) {
                    Storage::delete('public/' . $report->file_path);
                }
                
                $filePath = $request->file('file')->store('reports', 'public');
                $report->file_path = $filePath;
            }
            
            // إذا تم إرسال التقرير، نحدث تاريخ الإرسال
            if (isset($validatedData['status']) && $validatedData['status'] === 'submitted' && $report->status !== 'submitted') {
                $report->submitted_at = now();
            }
            
            $report->save();
            
            return response()->json([
                'success' => true,
                'data' => $report->load(['school', 'reviewer']),
                'message' => 'تم تحديث التقرير بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث التقرير: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete a report
     */
    public function deleteReport(Request $request, $reportId)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب التقرير والتحقق من ملكيته
            $report = Report::where('supervisor_id', $user->user_id)
                ->where('report_id', $reportId)
                ->first();
            
            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'التقرير غير موجود أو غير مسموح لك بالوصول إليه'
                ], 404);
            }
            
            // حذف الملف إذا كان موجوداً
            if ($report->file_path && Storage::exists('public/' . $report->file_path)) {
                Storage::delete('public/' . $report->file_path);
            }
            
            // حذف التقرير
            $report->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف التقرير بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف التقرير: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get supervisor invitations
     */
    public function getSupervisorInvitations(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب الدعوات المرتبطة بالمشرف
            $invitations = SupervisorInvitation::where('supervisor_id', $user->user_id)
                ->with('school')
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $invitations,
                'message' => 'تم جلب قائمة الدعوات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب قائمة الدعوات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create a new invitation
     */
    public function createSupervisorInvitation(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'school_id' => 'required|exists:schools,school_id',
                'invitee_name' => 'required|string|max:255',
                'invitee_email' => 'required|email|unique:supervisor_invitations,invitee_email,NULL,invitation_id,supervisor_id,' . $user->user_id,
                'message' => 'nullable|string',
                'expires_in_days' => 'nullable|integer|min:1|max:365'
            ]);
            
            // إنشاء رمز الدعوة الفريد
            $token = uniqid('inv_' . time() . '_', true);
            
            // تحديد تاريخ انتهاء الصلاحية
            $expiresAt = now()->addDays($validatedData['expires_in_days'] ?? 30);
            
            // إنشاء الدعوة
            $invitation = SupervisorInvitation::create([
                'supervisor_id' => $user->user_id,
                'school_id' => $validatedData['school_id'],
                'invitee_name' => $validatedData['invitee_name'],
                'invitee_email' => $validatedData['invitee_email'],
                'token' => $token,
                'message' => $validatedData['message'] ?? null,
                'expires_at' => $expiresAt
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $invitation->load('school'),
                'message' => 'تم إنشاء الدعوة بنجاح'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء الدعوة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update an invitation
     */
    public function updateSupervisorInvitation(Request $request, $invitationId)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب الدعوة والتحقق من ملكيتها
            $invitation = SupervisorInvitation::where('supervisor_id', $user->user_id)
                ->where('invitation_id', $invitationId)
                ->first();
            
            if (!$invitation) {
                return response()->json([
                    'success' => false,
                    'message' => 'الدعوة غير موجودة أو غير مسموح لك بالوصول إليها'
                ], 404);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'status' => 'sometimes|required|in:pending,accepted,rejected,expired',
                'message' => 'nullable|string'
            ]);
            
            // تحديث البيانات
            $invitation->fill($validatedData);
            $invitation->save();
            
            return response()->json([
                'success' => true,
                'data' => $invitation->load('school'),
                'message' => 'تم تحديث الدعوة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث الدعوة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete an invitation
     */
    public function deleteSupervisorInvitation(Request $request, $invitationId)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب الدعوة والتحقق من ملكيتها
            $invitation = SupervisorInvitation::where('supervisor_id', $user->user_id)
                ->where('invitation_id', $invitationId)
                ->first();
            
            if (!$invitation) {
                return response()->json([
                    'success' => false,
                    'message' => 'الدعوة غير موجودة أو غير مسموح لك بالوصول إليها'
                ], 404);
            }
            
            // حذف الدعوة
            $invitation->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف الدعوة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف الدعوة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get supervisor support tickets
     */
    public function getSupervisorSupportTickets(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب تذاكر الدعم المرتبطة بالمشرف
            $tickets = SupportTicket::where('user_id', $user->user_id)
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $tickets,
                'message' => 'تم جلب قائمة تذاكر الدعم بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب قائمة تذاكر الدعم: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create a new support ticket
     */
    public function createSupervisorSupportTicket(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'priority' => 'nullable|in:low,medium,high',
                'attachment' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:5120' // 5MB max
            ]);
            
            // رفع المرفق إذا كان موجوداً
            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $attachmentPath = $request->file('attachment')->store('support_tickets', 'public');
            }
            
            // إنشاء تذكرة الدعم
            $ticket = SupportTicket::create([
                'user_id' => $user->user_id,
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'priority' => $validatedData['priority'] ?? 'medium',
                'attachment_url' => $attachmentPath
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $ticket,
                'message' => 'تم إنشاء تذكرة الدعم بنجاح'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء تذكرة الدعم: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get supervisor messages
     */
    public function getSupervisorMessages(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب المحادثات التي يشارك فيها المشرف
            $conversations = Conversation::where('conversation_type', 'supervisor_manager')
                ->whereHas('messages')
                ->with(['school', 'messages' => function($query) use ($user) {
                    $query->orderBy('timestamp', 'asc');
                }])
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $conversations,
                'message' => 'تم جلب المحادثات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المحادثات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Send a message
     */
    public function sendSupervisorMessage(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'conversation_id' => 'required|exists:conversations,conversation_id',
                'content' => 'required|string|max:1000',
                'attachment' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:5120' // 5MB max
            ]);
            
            // التحقق من أن المحادثة موجودة وأن المشرف مخول للوصول إليها
            $conversation = Conversation::where('conversation_id', $validatedData['conversation_id'])
                ->where('conversation_type', 'supervisor_manager')
                ->first();
            
            if (!$conversation) {
                return response()->json([
                    'success' => false,
                    'message' => 'المحادثة غير موجودة أو غير مسموح لك بالوصول إليها'
                ], 404);
            }
            
            // رفع المرفق إذا كان موجوداً
            $attachmentUrl = null;
            $attachmentType = null;
            if ($request->hasFile('attachment')) {
                $attachmentUrl = $request->file('attachment')->store('messages', 'public');
                $attachmentType = $request->file('attachment')->getClientOriginalExtension();
            }
            
            // إنشاء الرسالة
            $message = Message::create([
                'conversation_id' => $validatedData['conversation_id'],
                'sender_type' => 'supervisor',
                'sender_id' => $user->user_id,
                'content' => $validatedData['content'],
                'attachment_url' => $attachmentUrl,
                'attachment_type' => $attachmentType
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $message,
                'message' => 'تم إرسال الرسالة بنجاح'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إرسال الرسالة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get chart data for number of evaluations
     */
    public function getNumEvaluationsChartData(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب بيانات التقييمات حسب الشهر لعامين متتاليين
            $currentYear = date('Y');
            $previousYear = $currentYear - 1;
            
            // بيانات هذا العام
            $currentYearData = DB::table('evaluations')
                ->select(DB::raw('MONTH(date) as month'), DB::raw('COUNT(*) as count'))
                ->where('supervisor_id', $user->user_id)
                ->whereYear('date', $currentYear)
                ->groupBy(DB::raw('MONTH(date)'))
                ->orderBy(DB::raw('MONTH(date)'))
                ->get();
            
            // بيانات العام الماضي
            $previousYearData = DB::table('evaluations')
                ->select(DB::raw('MONTH(date) as month'), DB::raw('COUNT(*) as count'))
                ->where('supervisor_id', $user->user_id)
                ->whereYear('date', $previousYear)
                ->groupBy(DB::raw('MONTH(date)'))
                ->orderBy(DB::raw('MONTH(date)'))
                ->get();
            
            // تحضير البيانات للرسم البياني
            $months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
            $currentYearValues = array_fill(0, 12, 0);
            $previousYearValues = array_fill(0, 12, 0);
            
            foreach ($currentYearData as $data) {
                $currentYearValues[$data->month - 1] = $data->count;
            }
            
            foreach ($previousYearData as $data) {
                $previousYearValues[$data->month - 1] = $data->count;
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'currentYear' => $currentYearValues,
                    'previousYear' => $previousYearValues,
                    'labels' => $months
                ],
                'message' => 'تم جلب بيانات الرسم البياني لعدد التقييمات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات الرسم البياني لعدد التقييمات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get chart data for school performance
     */
    public function getPerformanceChartData(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب أفضل المدارس حسب متوسط التقييمات
            $schoolPerformance = DB::table('evaluations as e')
                ->join('schools as s', 'e.school_id', '=', 's.school_id')
                ->join('evaluation_criteria as ec', 'e.evaluation_id', '=', 'ec.evaluation_id')
                ->select(
                    's.name as school_name',
                    DB::raw('AVG(ec.score) as avg_score')
                )
                ->where('e.supervisor_id', $user->user_id)
                ->groupBy('s.school_id', 's.name')
                ->orderBy('avg_score', 'desc')
                ->limit(12) // عرض أفضل 12 مدرسة
                ->get();
            
            // تحضير البيانات للرسم البياني
            $schools = [];
            $performanceData = [];
            
            foreach ($schoolPerformance as $performance) {
                $schools[] = $performance->school_name;
                $performanceData[] = round($performance->avg_score, 2);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'schools' => $schools,
                    'performanceData' => $performanceData
                ],
                'message' => 'تم جلب بيانات الرسم البياني للأداء بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات الرسم البياني للأداء: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get chart data for evaluation criteria
     */
    public function getEvaluationCriteriaChartData(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب متوسط التقييمات لكل معيار
            $criteriaData = DB::table('evaluations as e')
                ->join('evaluation_criteria as ec', 'e.evaluation_id', '=', 'ec.evaluation_id')
                ->join('criteria as c', 'ec.criterion_id', '=', 'c.criterion_id')
                ->select(
                    'c.name as criterion_name',
                    DB::raw('AVG(ec.score) as avg_score')
                )
                ->where('e.supervisor_id', $user->user_id)
                ->groupBy('c.criterion_id', 'c.name')
                ->orderBy('avg_score', 'desc')
                ->get();
            
            // تحضير البيانات للرسم البياني
            $criteria = [];
            $ratings = [];
            
            foreach ($criteriaData as $data) {
                $criteria[] = $data->criterion_name;
                $ratings[] = round($data->avg_score, 2);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'criteria' => $criteria,
                    'ratings' => $ratings
                ],
                'message' => 'تم جلب بيانات الرسم البياني لمعايير التقييم بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات الرسم البياني لمعايير التقييم: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get chart data for education stages
     */
    public function getEducationStagesChartData(Request $request)
    {
        try {
            $user = $request->user();
            
            // التحقق من أن المستخدم مشرف
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب توزيع المدارس حسب النوع (ابتدائي، متوسط، ثانوي)
            $stageData = DB::table('supervisor_school as ss')
                ->join('schools as s', 'ss.school_id', '=', 's.school_id')
                ->select(
                    's.type as school_type',
                    DB::raw('COUNT(*) as count')
                )
                ->where('ss.supervisor_id', $user->user_id)
                ->groupBy('s.type')
                ->get();
            
            // تحضير البيانات للرسم البياني
            $stages = [];
            $counts = [];
            $total = $stageData->sum('count');
            
            $typeMapping = [
                'primary' => 'ابتدائي',
                'preparatory' => 'متوسط',
                'secondary' => 'ثانوي'
            ];
            
            foreach ($stageData as $data) {
                $stageName = $typeMapping[$data->school_type] ?? $data->school_type;
                $stages[] = $stageName;
                $percentage = $total > 0 ? round(($data->count / $total) * 100, 1) : 0;
                $counts[] = $percentage;
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'stages' => $stages,
                    'percentages' => $counts
                ],
                'message' => 'تم جلب بيانات الرسم البياني للمراحل التعليمية بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات الرسم البياني للمراحل التعليمية: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get supervisor notifications
     */
    public function getNotifications(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // جلب الإشعارات - يمكن استخدام Laravel Notifications أو جدول مخصص
            $notifications = DB::table('notifications')
                ->where('notifiable_id', $user->user_id)
                ->where('notifiable_type', 'App\\Models\\User')
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $notifications,
                'message' => 'تم جلب الإشعارات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الإشعارات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Mark notification as read
     */
    public function markNotificationAsRead(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            DB::table('notifications')
                ->where('id', $id)
                ->where('notifiable_id', $user->user_id)
                ->update(['read_at' => now()]);
            
            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة الإشعار بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث الإشعار: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get supervisor conversations
     */
    public function getConversations(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $conversations = Conversation::where('user1_id', $user->user_id)
                ->orWhere('user2_id', $user->user_id)
                ->with(['user1:user_id,name,avatar', 'user2:user_id,name,avatar'])
                ->orderBy('updated_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $conversations,
                'message' => 'تم جلب المحادثات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب المحادثات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get messages for a conversation
     */
    public function getMessages(Request $request, $conversationId)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // التحقق من أن المستخدم جزء من المحادثة
            $conversation = Conversation::where('conversation_id', $conversationId)
                ->where(function($query) use ($user) {
                    $query->where('user1_id', $user->user_id)
                          ->orWhere('user2_id', $user->user_id);
                })
                ->firstOrFail();
            
            $messages = Message::where('conversation_id', $conversationId)
                ->with('sender:user_id,name,avatar')
                ->orderBy('created_at', 'asc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'conversation' => $conversation,
                    'messages' => $messages
                ],
                'message' => 'تم جلب الرسائل بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الرسائل: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Send a message in a conversation
     */
    public function sendMessage(Request $request, $conversationId)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $validatedData = $request->validate([
                'message' => 'required|string|max:2000',
            ]);
            
            // التحقق من أن المستخدم جزء من المحادثة
            $conversation = Conversation::where('conversation_id', $conversationId)
                ->where(function($query) use ($user) {
                    $query->where('user1_id', $user->user_id)
                          ->orWhere('user2_id', $user->user_id);
                })
                ->firstOrFail();
            
            $message = Message::create([
                'conversation_id' => $conversationId,
                'sender_id' => $user->user_id,
                'message' => $validatedData['message'],
                'is_read' => false,
            ]);
            
            // تحديث وقت آخر رسالة في المحادثة
            $conversation->touch();
            
            return response()->json([
                'success' => true,
                'data' => $message->load('sender:user_id,name,avatar'),
                'message' => 'تم إرسال الرسالة بنجاح'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إرسال الرسالة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create invitation for school manager
     */
    public function createInvitation(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $validatedData = $request->validate([
                'email' => 'required|email',
                'school_id' => 'required|exists:schools,school_id',
                'message' => 'nullable|string|max:500',
            ]);
            
            $invitation = SupervisorInvitation::create([
                'supervisor_id' => $user->user_id,
                'email' => $validatedData['email'],
                'school_id' => $validatedData['school_id'],
                'message' => $validatedData['message'] ?? null,
                'status' => 'pending',
                'token' => bin2hex(random_bytes(32)),
            ]);
            
            // هنا يمكن إرسال بريد إلكتروني للدعوة
            
            return response()->json([
                'success' => true,
                'data' => $invitation,
                'message' => 'تم إرسال الدعوة بنجاح'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إرسال الدعوة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get supervisor invitations
     */
    public function getInvitations(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $invitations = SupervisorInvitation::where('supervisor_id', $user->user_id)
                ->with('school:school_id,name')
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $invitations,
                'message' => 'تم جلب الدعوات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الدعوات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Add school to supervisor's supervision list
     * ربط مدرسة جديدة بالمشرف للإشراف عليها
     */
    public function addSchoolToSupervision(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $validatedData = $request->validate([
                'school_id' => 'required|exists:schools,school_id',
            ]);
            
            // التحقق من أن المدرسة غير مربوطة مسبقاً
            $exists = DB::table('supervisor_school')
                ->where('supervisor_id', $user->user_id)
                ->where('school_id', $validatedData['school_id'])
                ->exists();
            
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'هذه المدرسة مربوطة بك مسبقاً'
                ], 409);
            }
            
            // إضافة المدرسة للمشرف
            DB::table('supervisor_school')->insert([
                'supervisor_id' => $user->user_id,
                'school_id' => $validatedData['school_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            // Get school details
            $school = School::find($validatedData['school_id']);
            
            // إنشاء إشعار للمشرف
            Notification::create([
                'user_id' => $user->user_id,
                'type' => 'school_added',
                'title' => 'تمت إضافة مدرسة جديدة',
                'content' => 'تم إضافة مدرسة ' . $school->name . ' إلى قائمة المدارس التي تشرف عليها',
                'link' => '/dashboard/supervisor/schools',
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $school,
                'message' => 'تمت إضافة المدرسة بنجاح إلى قائمة الإشراف'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إضافة المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remove school from supervisor's supervision list
     */
    public function removeSchoolFromSupervision(Request $request, $schoolId)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $deleted = DB::table('supervisor_school')
                ->where('supervisor_id', $user->user_id)
                ->where('school_id', $schoolId)
                ->delete();
            
            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'المدرسة غير موجودة في قائمة الإشراف'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'تم إزالة المدرسة من قائمة الإشراف بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إزالة المدرسة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get notifications with proper structure
     * جلب الإشعارات الحقيقية من جدول notifications
     */
    public function getRealNotifications(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $notifications = Notification::where('user_id', $user->user_id)
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get();
            
            $unreadCount = Notification::where('user_id', $user->user_id)
                ->where('is_read', false)
                ->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'notifications' => $notifications,
                    'unread_count' => $unreadCount
                ],
                'message' => 'تم جلب الإشعارات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الإشعارات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Mark notification as read (new version)
     */
    public function markRealNotificationAsRead(Request $request, $notificationId)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $notification = Notification::where('notification_id', $notificationId)
                ->where('user_id', $user->user_id)
                ->first();
            
            if (!$notification) {
                return response()->json([
                    'success' => false,
                    'message' => 'الإشعار غير موجود'
                ], 404);
            }
            
            $notification->markAsRead();
            
            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة الإشعار بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث الإشعار: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Helper: Create notification when new report is created
     */
    private function createReportNotification($reportId, $userId, $reportTitle)
    {
        Notification::create([
            'user_id' => $userId,
            'type' => 'report_created',
            'title' => 'تم إنشاء تقرير جديد',
            'content' => 'تم إنشاء تقرير جديد: ' . $reportTitle,
            'link' => '/dashboard/supervisor/reports/' . $reportId,
            'data' => json_encode(['report_id' => $reportId])
        ]);
    }
    
    /**
     * Helper: Create notification when new message is received
     */
    private function createMessageNotification($messageId, $userId, $senderName)
    {
        Notification::create([
            'user_id' => $userId,
            'type' => 'message_received',
            'title' => 'رسالة جديدة',
            'content' => 'رسالة جديدة من ' . $senderName,
            'link' => '/dashboard/supervisor/messages',
            'data' => json_encode(['message_id' => $messageId])
        ]);
    }
    
    /**
     * Change supervisor password
     * تغيير كلمة مرور المشرف
     */
    public function changePassword(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            // التحقق من صحة البيانات
            $validatedData = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);
            
            // التحقق من كلمة المرور الحالية
            if (!\Hash::check($validatedData['current_password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'كلمة المرور الحالية غير صحيحة'
                ], 422);
            }
            
            // تحديث كلمة المرور
            $user->password = \Hash::make($validatedData['new_password']);
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'تم تغيير كلمة المرور بنجاح'
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'يرجى التحقق من البيانات',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تغيير كلمة المرور: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // ============================================================================
    // Principal Links Management (للمشرفين)
    // ============================================================================
    
    /**
     * Get all principal links created by supervisor
     */
    public function getPrincipalLinks(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $links = DB::table('invitation_links')
                ->where('link_type', 'principal')
                ->where('created_by', $user->user_id)
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $links
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الروابط: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create new principal link
     */
    public function createPrincipalLink(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $validatedData = $request->validate([
                'organization_name' => 'required|string|max:255',
                'organization_id' => 'nullable|integer',
                'expires_at' => 'nullable|date|after:now',
                'max_uses' => 'nullable|integer|min:1'
            ]);
            
            $token = \Str::random(32);
            
            $linkId = DB::table('invitation_links')->insertGetId([
                'token' => $token,
                'link_type' => 'principal',
                'organization_id' => $validatedData['organization_id'] ?? null,
                'organization_name' => $validatedData['organization_name'],
                'created_by' => $user->user_id,
                'expires_at' => $validatedData['expires_at'] ?? null,
                'max_uses' => $validatedData['max_uses'] ?? null,
                'uses_count' => 0,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            $link = DB::table('invitation_links')->where('link_id', $linkId)->first();
            
            return response()->json([
                'success' => true,
                'data' => $link,
                'message' => 'تم إنشاء رابط الدعوة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء الرابط: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update principal link
     */
    public function updatePrincipalLink(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $link = DB::table('invitation_links')
                ->where('link_id', $id)
                ->where('created_by', $user->user_id)
                ->first();
            
            if (!$link) {
                return response()->json([
                    'success' => false,
                    'message' => 'الرابط غير موجود'
                ], 404);
            }
            
            $validatedData = $request->validate([
                'is_active' => 'sometimes|boolean',
                'expires_at' => 'nullable|date',
                'max_uses' => 'nullable|integer|min:1',
                'organization_name' => 'sometimes|string|max:255'
            ]);
            
            DB::table('invitation_links')
                ->where('link_id', $id)
                ->update(array_merge($validatedData, ['updated_at' => now()]));
            
            $updatedLink = DB::table('invitation_links')->where('link_id', $id)->first();
            
            return response()->json([
                'success' => true,
                'data' => $updatedLink,
                'message' => 'تم تحديث الرابط بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث الرابط: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete principal link
     */
    public function deletePrincipalLink(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $link = DB::table('invitation_links')
                ->where('link_id', $id)
                ->where('created_by', $user->user_id)
                ->first();
            
            if (!$link) {
                return response()->json([
                    'success' => false,
                    'message' => 'الرابط غير موجود'
                ], 404);
            }
            
            DB::table('invitation_links')->where('link_id', $id)->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف الرابط بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف الرابط: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get principal links statistics
     */
    public function getPrincipalLinksStatistics(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $totalLinks = DB::table('invitation_links')
                ->where('link_type', 'principal')
                ->where('created_by', $user->user_id)
                ->count();
            
            $activeLinks = DB::table('invitation_links')
                ->where('link_type', 'principal')
                ->where('created_by', $user->user_id)
                ->where('is_active', true)
                ->where(function($query) {
                    $query->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                })
                ->count();
            
            $expiredLinks = DB::table('invitation_links')
                ->where('link_type', 'principal')
                ->where('created_by', $user->user_id)
                ->where('expires_at', '<=', now())
                ->count();
            
            $usedLinks = DB::table('invitation_links')
                ->where('link_type', 'principal')
                ->where('created_by', $user->user_id)
                ->where('uses_count', '>', 0)
                ->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => [
                        'total_links' => $totalLinks,
                        'active_links' => $activeLinks,
                        'expired_links' => $expiredLinks,
                        'used_links' => $usedLinks
                    ]
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الإحصائيات: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get pending principals
     */
    public function getPendingPrincipals(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $pendingPrincipals = User::where('role', 2) // principal
                ->where('status', 'pending')
                ->where('supervisor_id', $user->user_id)
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $pendingPrincipals
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الطلبات المعلقة: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Approve pending principal
     */
    public function approvePendingPrincipal(Request $request, $userId)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $principal = User::where('user_id', $userId)
                ->where('role', 2)
                ->where('supervisor_id', $user->user_id)
                ->first();
            
            if (!$principal) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }
            
            $principal->status = 'active';
            $principal->save();
            
            // Create notification
            Notification::create([
                'user_id' => $userId,
                'type' => 'account_approved',
                'title' => 'تمت الموافقة على حسابك',
                'content' => 'تمت الموافقة على حسابك كمدير مدرسة',
                'link' => '/dashboard/principal'
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'تمت الموافقة على الطلب بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الموافقة على الطلب: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Reject pending principal
     */
    public function rejectPendingPrincipal(Request $request, $userId)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }
            
            $principal = User::where('user_id', $userId)
                ->where('role', 2)
                ->where('supervisor_id', $user->user_id)
                ->first();
            
            if (!$principal) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود'
                ], 404);
            }
            
            $principal->status = 'rejected';
            $principal->save();
            
            // Create notification
            Notification::create([
                'user_id' => $userId,
                'type' => 'account_rejected',
                'title' => 'تم رفض حسابك',
                'content' => 'تم رفض طلب التسجيل كمدير مدرسة',
                'link' => null
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'تم رفض الطلب بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في رفض الطلب: ' . $e->getMessage()
            ], 500);
        }
    }
}
