<?php

namespace App\Http\Controllers\Api\public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\Setting;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Get contact information
     */
    public function getContactInfo()
    {
        try {
            $phone = Setting::where('key', 'contact_phone')->first();
            $email = Setting::where('key', 'contact_email')->first();
            $address = Setting::where('key', 'contact_address')->first();
            $workingHours = Setting::where('key', 'working_hours')->first();
            $mapLocation = Setting::where('key', 'map_location')->first();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'phone' => $phone ? $phone->value : '+966 11 234 5678',
                    'email' => $email ? $email->value : 'info@ruaa-edu.sa',
                    'address' => $address ? $address->value : 'الرياض، المملكة العربية السعودية',
                    'workingHours' => $workingHours ? $workingHours->value : 'الأحد - الخميس: 8 صباحاً - 4 مساءً',
                    'mapLocation' => $mapLocation ? json_decode($mapLocation->value, true) : [
                        'lat' => 24.7136,
                        'lng' => 46.6753
                    ]
                ],
                'message' => 'تم جلب معلومات التواصل بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب معلومات التواصل',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Store contact form submission
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|min:3|max:100',
                'email' => 'required|email|max:100',
                'phone' => 'nullable|string|max:20',
                'subject' => 'required|string|min:3|max:200',
                'message' => 'required|string|min:10|max:1000',
            ], [
                'name.required' => 'الاسم مطلوب',
                'name.min' => 'الاسم يجب أن يكون 3 أحرف على الأقل',
                'email.required' => 'البريد الإلكتروني مطلوب',
                'email.email' => 'البريد الإلكتروني غير صحيح',
                'subject.required' => 'الموضوع مطلوب',
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
            
            $contact = Contact::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'subject' => $request->subject,
                'message' => $request->message,
                'status' => 'pending',
                'ip_address' => $request->ip(),
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $contact,
                'message' => 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً'
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الرسالة',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
}
