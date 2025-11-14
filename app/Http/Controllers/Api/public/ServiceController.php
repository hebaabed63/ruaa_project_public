<?php

namespace App\Http\Controllers\Api\public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    /**
     * Get all services
     */
    public function index()
    {
        try {
            $services = Service::where('active', true)
                ->orderBy('order', 'asc')
                ->get(['service_id', 'title', 'description', 'icon', 'order']);
            
            return response()->json([
                'success' => true,
                'data' => $services,
                'message' => 'تم جلب الخدمات بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الخدمات',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Get single service
     */
    public function show($id)
    {
        try {
            $service = Service::where('active', true)
                ->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $service,
                'message' => 'تم جلب تفاصيل الخدمة بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'الخدمة غير موجودة',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 404);
        }
    }
}
