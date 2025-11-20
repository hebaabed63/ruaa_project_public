<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\School;
use App\Models\Evaluation;
use App\Models\User;

class AdminReportsController extends Controller
{
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
}