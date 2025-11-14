<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\School;
use App\Models\ParentChild;
use App\Models\ParentNotification;
use App\Models\SchoolRating;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ParentDashboardController extends Controller
{
    /**
     * التحقق من أن المستخدم ولي أمر
     */
    private function ensureParent($user)
    {
        if (($user->role ?? null) !== 3) {
            abort(response()->json([
                'success' => false,
                'message' => 'غير مصرح لك بالوصول لهذه الصفحة'
            ], 403));
        }
    }

    /**
     * Display the parent dashboard main page.
     * GET /api/parent/dashboard
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // 1. Statistics - الإحصائيات
            $statistics = $this->getStatistics($user);

            // 2. Recent Notifications - آخر الإشعارات
            $recentNotifications = $this->getRecentNotifications($user, 5);

            // 3. Children Schools - مدارس الأبناء
            $childrenSchools = $this->getChildrenSchools($user);

            return response()->json([
                'success' => true,
                'message' => 'تم جلب بيانات لوحة التحكم بنجاح',
                'data' => [
                    'user_name' => $user->name,
                    'statistics' => $statistics,
                    'recent_notifications' => $recentNotifications,
                    'children_schools' => $childrenSchools,
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Dashboard Error: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب بيانات لوحة التحكم',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get statistics for parent dashboard
     */
    private function getStatistics($user)
    {
        // عدد الأبناء النشطين
        $childrenCount = ParentChild::where('parent_id', $user->user_id)
            ->where('status', 'active')
            ->count();

        // عدد المدارس المميزة
        $schoolsCount = ParentChild::where('parent_id', $user->user_id)
            ->where('status', 'active')
            ->distinct('school_id')
            ->count('school_id');

        // متوسط تقييم المدارس
        $schoolIds = ParentChild::where('parent_id', $user->user_id)
            ->where('status', 'active')
            ->pluck('school_id')
            ->filter()
            ->unique()
            ->values();

        $averageRating = School::whereIn('school_id', $schoolIds)
            ->whereNotNull('rating')
            ->avg('rating') ?? 0;

        // عدد التقييمات المقدمة من ولي الأمر
        $activeEvaluations = SchoolRating::where('user_id', $user->user_id)
            ->count();

        // عدد الإشعارات غير المقروءة
        $pendingNotifications = ParentNotification::where('user_id', $user->user_id)
            ->where('is_read', false)
            ->count();

        // النشاطات الحديثة
        $recentActivities = $this->getRecentActivities($user);

        return [
            'childrenCount' => $childrenCount,
            'totalSchools' => $schoolsCount,
            'averageRating' => round($averageRating, 1),
            'activeEvaluations' => $activeEvaluations,
            'pendingNotifications' => $pendingNotifications,
            'recentActivities' => $recentActivities,
        ];
    }

    /**
     * Get recent activities
     */
    private function getRecentActivities($user)
    {
        $activities = collect();

        // آخر التقييمات
        $recentRatings = SchoolRating::where('user_id', $user->user_id)
            ->with('school:school_id,name')
            ->orderBy('created_at', 'desc')
            ->limit(2)
            ->get()
            ->map(function ($rating) {
                return [
                    'id' => 'rating_' . $rating->id,
                    'type' => 'rating',
                    'title' => 'تقييم مدرسة',
                    'description' => 'قمت بتقييم مدرسة ' . ($rating->school->name ?? ''),
                    'icon' => '⭐',
                    'timestamp' => $rating->created_at,
                    'color' => 'text-yellow-600',
                ];
            });

        // آخر الإشعارات
        $recentNotifications = ParentNotification::where('user_id', $user->user_id)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => 'notif_' . $notification->notification_id,
                    'type' => 'notification',
                    'title' => $notification->title,
                    'description' => $notification->message,
                    'icon' => '🔔',
                    'timestamp' => $notification->created_at,
                    'color' => 'text-blue-600',
                ];
            });

        return $activities->merge($recentRatings)
                         ->merge($recentNotifications)
                         ->sortByDesc('timestamp')
                         ->values()
                         ->take(5);
    }

    /**
     * Get recent notifications
     */
    private function getRecentNotifications($user, $limit = 5)
    {
        return ParentNotification::where('user_id', $user->user_id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->notification_id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'type' => $notification->type,
                    'is_read' => (bool) $notification->is_read,
                    'created_at' => $notification->created_at->toISOString(),
                    'read_at' => $notification->read_at?->toISOString(),
                    'related_school_id' => $notification->related_school_id,
                ];
            });
    }

    /**
     * Get children and their schools
     */
    private function getChildrenSchools($user)
    {
        $children = ParentChild::where('parent_id', $user->user_id)
            ->where('status', 'active')
            ->with(['school' => function($query) {
                $query->select(
                    'school_id',
                    'name',
                    'english_name',
                    'description',
                    'logo',
                    'cover_image',
                    'rating',
                    'reviews_count',
                    'address',
                    'city',
                    'region',
                    'type',
                    'level'
                );
            }])
            ->get();

        // تجميع المدارس مع أبنائها
        $schoolsData = $children->groupBy('school_id');

        return $schoolsData->map(function ($children, $schoolId) {
            $school = $children->first()->school;
            if (!$school) return null;

            return [
                'id' => $school->school_id,
                'name' => $school->name,
                'englishName' => $school->english_name,
                'description' => $school->description,
                'logo' => $school->logo,
                'coverImage' => $school->cover_image,
                'overallRating' => round($school->rating ?? 0, 1),
                'reviewsCount' => $school->reviews_count ?? 0,
                'address' => $school->address,
                'city' => $school->city,
                'region' => $school->region,
                'type' => $school->type,
                'level' => $school->level,
                'children' => $children->map(function ($child) {
                    return [
                        'id' => $child->child_id,
                        'name' => $child->child_name,
                        'grade' => $child->child_grade ?? 'غير محدد',
                        'section' => $child->child_section ?? 'غير محدد',
                    ];
                })->values(),
            ];
        })->filter()->values();
    }

    /**
     * Get all schools for parent
     * GET /api/parent/schools
     */
    public function getSchools(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $schools = $this->getChildrenSchools($user);

            return response()->json([
                'success' => true,
                'message' => 'تم جلب المدارس بنجاح',
                'data' => [
                    'schools' => $schools,
                    'total' => count($schools),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Schools Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المدارس',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get specific school details
     * GET /api/parent/schools/{id}
     */
    public function getSchoolDetails(Request $request, $schoolId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // التحقق من أن ولي الأمر لديه ابن في هذه المدرسة
            $childExists = ParentChild::where('parent_id', $user->user_id)
                ->where('school_id', $schoolId)
                ->where('status', 'active')
                ->exists();

            if (!$childExists) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح لك بعرض تفاصيل هذه المدرسة'
                ], 403);
            }

            // جلب تفاصيل المدرسة
            $school = School::with(['ratings' => function($query) {
                $query->where('is_approved', true)->latest();
            }])->findOrFail($schoolId);

            // جلب تقييم ولي الأمر
            $userRating = SchoolRating::where('school_id', $schoolId)
                ->where('user_id', $user->user_id)
                ->first();

            // جلب الأبناء في هذه المدرسة
            $children = ParentChild::where('parent_id', $user->user_id)
                ->where('school_id', $schoolId)
                ->where('status', 'active')
                ->get(['child_id', 'child_name', 'child_grade', 'child_section']);

            return response()->json([
                'success' => true,
                'message' => 'تم جلب تفاصيل المدرسة بنجاح',
                'data' => [
                    'school' => $this->formatSchoolData($school, $userRating, $children)
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent School Details Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب تفاصيل المدرسة',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Format school data for response
     */
    private function formatSchoolData($school, $userRating, $children)
    {
        $averageRating = $school->ratings->avg('rating') ?? 0;
        $totalRatings = $school->ratings->count();

        return [
            'id' => $school->school_id,
            'name' => $school->name,
            'english_name' => $school->english_name,
            'description' => $school->description,
            'logo' => $school->logo,
            'cover_image' => $school->cover_image,
            'address' => $school->address,
            'region' => $school->region,
            'city' => $school->city,
            'type' => $school->type,
            'level' => $school->level,
            'phone' => $school->phone,
            'email' => $school->email,
            'website' => $school->website,
            'rating' => round($averageRating, 1),
            'total_ratings' => $totalRatings,
            'user_rating' => $userRating ? [
                'id' => $userRating->id,
                'rating' => $userRating->rating,
                'comment' => $userRating->comment,
                'created_at' => $userRating->created_at->toISOString(),
            ] : null,
            'children' => $children,
            'features' => $school->features ?? [],
            'certifications' => $school->certifications ?? [],
            'achievements' => $school->achievements ?? [],
        ];
    }

    /**
     * Rate a school
     * POST /api/parent/schools/{id}/rate
     */
    public function rateSchool(Request $request, $schoolId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // التحقق من الصلاحية
            $childExists = ParentChild::where('parent_id', $user->user_id)
                ->where('school_id', $schoolId)
                ->where('status', 'active')
                ->exists();

            if (!$childExists) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح لك بتقييم هذه المدرسة'
                ], 403);
            }

            $validated = $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
                'criteria' => 'nullable|array',
            ]);

            $school = School::findOrFail($schoolId);

            $rating = SchoolRating::updateOrCreate(
                [
                    'school_id' => $schoolId,
                    'user_id' => $user->user_id,
                ],
                [
                    'parent_name' => $user->name,
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'] ?? null,
                    'criteria' => $validated['criteria'] ?? null,
                    'is_approved' => false,
                ]
            );

            // تحديث إحصائيات المدرسة
            $this->updateSchoolRating($schoolId);

            return response()->json([
                'success' => true,
                'message' => 'تم إرسال التقييم بنجاح وسينشر بعد المراجعة',
                'data' => [
                    'rating' => [
                        'id' => $rating->id,
                        'rating' => $rating->rating,
                        'comment' => $rating->comment,
                        'created_at' => $rating->created_at->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Rate School Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال التقييم',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Update school's average rating
     */
    private function updateSchoolRating($schoolId)
    {
        try {
            $school = School::find($schoolId);
            if (!$school) return;

            $approvedRatings = SchoolRating::where('school_id', $schoolId)
                ->where('is_approved', true);

            $averageRating = $approvedRatings->avg('rating') ?? 0;
            $ratingCount = $approvedRatings->count();

            $school->update([
                'rating' => round($averageRating, 2),
                'reviews_count' => $ratingCount,
            ]);
        } catch (\Exception $e) {
            Log::error('Update School Rating Error: ' . $e->getMessage());
        }
    }

    /**
     * Get notifications
     * GET /api/parent/notifications
     */
    public function getNotifications(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $limit = $request->get('limit', 20);
            $unreadOnly = $request->get('unread_only', false);

            $query = ParentNotification::where('user_id', $user->user_id);

            if ($unreadOnly) {
                $query->where('is_read', false);
            }

            $notifications = $query->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->notification_id,
                        'title' => $notification->title,
                        'message' => $notification->message,
                        'type' => $notification->type,
                        'is_read' => (bool) $notification->is_read,
                        'related_school_id' => $notification->related_school_id,
                        'read_at' => $notification->read_at?->toISOString(),
                        'created_at' => $notification->created_at->toISOString(),
                    ];
                });

            $unreadCount = ParentNotification::where('user_id', $user->user_id)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب الإشعارات بنجاح',
                'data' => [
                    'notifications' => $notifications,
                    'unread_count' => $unreadCount,
                    'total' => $notifications->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Notifications Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الإشعارات',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Mark notification as read
     * PUT /api/parent/notifications/{id}/read
     */
    public function markNotificationAsRead(Request $request, $id)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $notification = ParentNotification::where('notification_id', $id)
                ->where('user_id', $user->user_id)
                ->firstOrFail();

            if (!$notification->is_read) {
                $notification->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة الإشعار بنجاح'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Mark Notification Read Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الإشعار'
            ], 500);
        }
    }
}