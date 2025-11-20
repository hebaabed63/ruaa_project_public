<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminLinksController extends Controller
{
    /**
     * Get supervisor links (for admin)
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
                ->leftJoin('users', 'supervisor_links.organization_id', '=', 'users.user_id')
                ->select(
                    'supervisor_links.link_id as id',
                    'supervisor_links.token',
                    'supervisor_links.link_type',
                    'supervisor_links.organization_name as institution',
                    'supervisor_links.is_active as status',
                    'supervisor_links.used_count',
                    'supervisor_links.max_uses as max_usages',
                    'supervisor_links.expires_at',
                    'supervisor_links.created_at'
                )
                ->orderBy('supervisor_links.created_at', 'desc')
                ->get();

            // تحويل الحقول لتتوافق مع الـ Frontend
            $transformedLinks = $links->map(function ($link) {
                return [
                    'id' => $link->id,
                    'token' => $link->token,
                    'link_type' => $link->link_type,
                    'institution' => $link->institution ?? 'غير محدد',
                    'status' => $link->status ? 'active' : 'inactive',
                    'used_count' => $link->used_count,
                    'max_usages' => $link->max_usages,
                    'expires_at' => $link->expires_at,
                    'created_at' => $link->created_at
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedLinks,
                'message' => 'تم جلب روابط المشرفين بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الروابط: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create supervisor link (for admin)
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
                'institution' => 'required|string|max:255',
                'expiration' => 'nullable|date|after:now',
                'usages' => 'nullable|integer|min:1|max:100'
            ]);

            // إنشاء توكن فريد
            $token = Str::random(32);
            while (DB::table('supervisor_links')->where('token', $token)->exists()) {
                $token = Str::random(32);
            }

            $linkId = DB::table('supervisor_links')->insertGetId([
                'token' => $token,
                'link_type' => 'supervisor', // نوع افتراضي
                'organization_name' => $validated['institution'],
                'expires_at' => $validated['expiration'] ?? null,
                'max_uses' => $validated['usages'] ?? null,
                'is_active' => true,
                'used_count' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $link = DB::table('supervisor_links')
                ->where('link_id', $linkId)
                ->first();

            // تحويل البيانات للاستجابة
            $transformedLink = [
                'id' => $link->link_id,
                'token' => $link->token,
                'link_type' => $link->link_type,
                'institution' => $link->organization_name,
                'status' => $link->is_active ? 'active' : 'inactive',
                'used_count' => $link->used_count,
                'max_usages' => $link->max_uses,
                'expires_at' => $link->expires_at,
                'created_at' => $link->created_at
            ];

            return response()->json([
                'success' => true,
                'data' => $transformedLink,
                'message' => 'تم إنشاء رابط الدعوة بنجاح'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء الرابط: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update supervisor link (for admin)
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

            $link = DB::table('supervisor_links')
                ->where('link_id', $id)
                ->first();

            if (!$link) {
                return response()->json([
                    'success' => false,
                    'message' => 'الرابط غير موجود'
                ], 404);
            }

            $validated = $request->validate([
                'institution' => 'sometimes|string|max:255',
                'expiration' => 'nullable|date|after:now',
                'usages' => 'nullable|integer|min:1|max:100',
                'status' => 'sometimes|in:active,inactive'
            ]);

            // تحويل status إلى boolean
            $isActive = isset($validated['status']) ? ($validated['status'] === 'active') : $link->is_active;

            // تحديث الرابط
            DB::table('supervisor_links')
                ->where('link_id', $id)
                ->update([
                    'organization_name' => $validated['institution'] ?? $link->organization_name,
                    'expires_at' => $validated['expiration'] ?? $link->expires_at,
                    'max_uses' => $validated['usages'] ?? $link->max_uses,
                    'is_active' => $isActive,
                    'updated_at' => now()
                ]);

            // جلب الرابط المحدث
            $updatedLink = DB::table('supervisor_links')
                ->where('link_id', $id)
                ->first();

            // تحويل البيانات للاستجابة
            $transformedLink = [
                'id' => $updatedLink->link_id,
                'token' => $updatedLink->token,
                'link_type' => $updatedLink->link_type,
                'institution' => $updatedLink->organization_name,
                'status' => $updatedLink->is_active ? 'active' : 'inactive',
                'used_count' => $updatedLink->used_count,
                'max_usages' => $updatedLink->max_uses,
                'expires_at' => $updatedLink->expires_at,
                'created_at' => $updatedLink->created_at
            ];

            return response()->json([
                'success' => true,
                'data' => $transformedLink,
                'message' => 'تم تحديث رابط الدعوة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الرابط: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete supervisor link (for admin)
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
     * Supervisor links statistics (for admin)
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
                    'supervisor_links.organization_name as institution',
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
}