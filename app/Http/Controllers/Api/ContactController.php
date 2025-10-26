<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Store contact form submission
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'subject' => 'required|string|max:255',
                'message' => 'required|string|max:2000',
            ], [
                'name.required' => 'الاسم مطلوب',
                'email.required' => 'البريد الإلكتروني مطلوب',
                'email.email' => 'يرجى إدخال بريد إلكتروني صحيح',
                'subject.required' => 'الموضوع مطلوب',
                'message.required' => 'الرسالة مطلوبة',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'بيانات غير صالحة',
                    'errors' => $validator->errors()
                ], 422);
            }

            $contact = Contact::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'subject' => $request->subject,
                'message' => $request->message,
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً',
                'data' => $contact
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الرسالة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get contact info and map data
     * 
     * @return JsonResponse
     */
    public function getContactInfo(): JsonResponse
    {
        try {
            $data = [
                'contactInfo' => [
                    'email' => 'info@ruaa-platform.ps',
                    'phone' => '+970-2-123-4567',
                    'address' => 'رام الله، فلسطين',
                    'workingHours' => 'السبت - الخميس: 8:00 - 16:00'
                ],
                'mapData' => [
                    'coordinates' => [
                        'lat' => 31.8,
                        'lng' => 35.0
                    ],
                    'embedUrl' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d866748.4208940891!2d34.367485!3d31.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502b7dbf8fd2d0b%3A0x85eb7e9c9b6eca7b!2sPalestine!5e0!3m2!1sen!2s!4v1647887231234!5m2!1sen!2s',
                    'zoomLevel' => 8
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $data
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
