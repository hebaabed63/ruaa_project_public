<?php

namespace App\Http\Controllers\Api\Supervisor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\School;
use App\Models\Evaluation;
use App\Models\Report;
use App\Models\SupervisorInvitation;

class SupervisorDashboardController extends Controller
{
    /**
     * التحقق من أن المستخدم مشرف (role = 1)
     */
    private function ensureSupervisor($user)
    {
        if (($user->role ?? null) !== 1) {
            abort(response()->json([
                'success' => false,
                'message' => 'غير مسموح لك بالوصول لهذه البيانات'
            ], 403));
        }
    }

    /**
     * GET /api/supervisor/dashboard/stats
     * إحصائيات لوحة تحكم المشرف
     */
    public function getDashboardStats(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            // إحصائيات المدارس
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

            // طلبات المدراء المعلقة
            $pendingRequests = User::where('role', 2)
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
     * GET /api/supervisor/dashboard/charts/evaluations
     * بيانات الرسم البياني لعدد التقييمات
     */
    public function getNumEvaluationsChartData(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

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

            // تحضير البيانات
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
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات الرسم البياني'
            ], 500);
        }
    }

    /**
     * GET /api/supervisor/dashboard/charts/performance
     * بيانات الرسم البياني لأداء المدارس
     */
    public function getPerformanceChartData(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

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
                ->limit(12)
                ->get();

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
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات الأداء'
            ], 500);
        }
    }

    /**
     * GET /api/supervisor/dashboard/charts/education-stages
     * بيانات الرسم البياني للمراحل التعليمية
     */
    public function getEducationStagesChartData(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            $stageData = DB::table('supervisor_school as ss')
                ->join('schools as s', 'ss.school_id', '=', 's.school_id')
                ->select(
                    's.type as school_type',
                    DB::raw('COUNT(*) as count')
                )
                ->where('ss.supervisor_id', $user->user_id)
                ->groupBy('s.type')
                ->get();

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
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب بيانات المراحل التعليمية'
            ], 500);
        }
    }

    /**
     * GET /api/supervisor/dashboard/recent-activities
     * النشاطات الحديثة
     */
    public function getRecentActivities(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureSupervisor($user);

            // آخر التقييمات
            $recentEvaluations = DB::table('evaluations')
                ->where('supervisor_id', $user->user_id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            // آخر التقارير
            $recentReports = DB::table('reports')
                ->where('supervisor_id', $user->user_id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            // آخر المدارس المضافة
            $recentSchools = DB::table('supervisor_school')
                ->where('supervisor_id', $user->user_id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'evaluations' => $recentEvaluations,
                    'reports' => $recentReports,
                    'schools' => $recentSchools
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب النشاطات الحديثة'
            ], 500);
        }
    }
}