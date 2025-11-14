<?php

namespace App\Http\Controllers\Api\public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    /**
     * Get all feedback (for admin/display)
     */
    public function index(Request $request)
    {
        try {
            $query = Feedback::where('status', 'approved')
                ->orderBy('created_at', 'desc');
            
            if ($request->has('limit')) {
                $feedback = $query->limit($request->limit)->get();
            } else {
                $feedback = $query->paginate(10);
            }
            
            return response()->json([
                'success' => true,
                'data' => $feedback,
                'message' => 'تم جلب الآراء بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الآراء',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Submit feedback
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|min:3|max:100',
                'email' => 'required|email|max:100',
                'rating' => 'required|integer|min:1|max:5',
                'message' => 'required|string|min:10|max:1000',
                'category' => 'nullable|string|in:suggestion,complaint,praise,other',
            ], [
                'name.required' => 'الاسم مطلوب',
                'email.required' => 'البريد الإلكتروني مطلوب',
                'email.email' => 'البريد الإلكتروني غير صحيح',
                'rating.required' => 'التقييم مطلوب',
                'rating.min' => 'التقييم يجب أن يكون بين 1 و 5',
                'rating.max' => 'التقييم يجب أن يكون بين 1 و 5',
                'message.required' => 'الرسالة مطلوبة',
                'message.min' => 'الرسالة يجب أن تكون 10 أحرف على الأقل',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'خطأ في البيانات المدخلة',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $feedback = Feedback::create([
                'name' => $request->name,
                'email' => $request->email,
                'rating' => $request->rating,
                'message' => $request->message,
                'category' => $request->category ?? 'other',
                'status' => 'pending',
                'ip_address' => $request->ip(),
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $feedback,
                'message' => 'شكراً لك! تم إرسال رأيك بنجاح'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الرأي',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
}
