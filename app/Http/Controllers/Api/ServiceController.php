<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    /**
     * Get all active services
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $services = Service::active()->get()->map(function($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'description' => $service->description,
                    'icon' => $service->icon,
                    'features' => $service->features,
                    'order' => $service->order
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $services
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
