<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ParentChild;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ParentComplaintsController extends Controller
{
    /**
     * Ensure the authenticated user is a parent (role = 3)
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
     * Get metadata: complaint types + children's schools
     * GET /api/parent/complaints/meta
     */
    public function meta(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // Complaint types
            $types = [
                ['key' => 'academic', 'label' => 'شكوى أكاديمية'],
                ['key' => 'behavior', 'label' => 'شكوى سلوكية'],
                ['key' => 'transport', 'label' => 'شكوى النقل'],
                ['key' => 'facility', 'label' => 'شكوى مرافق'],
                ['key' => 'teacher', 'label' => 'شكوى معلم'],
                ['key' => 'administration', 'label' => 'شكوى إدارية'],
                ['key' => 'safety', 'label' => 'شكوى أمن وسلامة'],
                ['key' => 'other', 'label' => 'شكوى أخرى'],
            ];

            // Get children's schools
            $childrenSchools = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->with(['school:school_id,name,type'])
                ->get()
                ->map(function ($record) {
                    return [
                        'school_id' => $record->school_id,
                        'school_name' => $record->school->name ?? 'مدرسة',
                        'school_type' => $record->school->type ?? 'غير محدد',
                        'child_name' => $record->child_name,
                        'child_grade' => $record->child_grade,
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب البيانات بنجاح',
                'data' => [
                    'types' => $types,
                    'children_schools' => $childrenSchools
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Complaints Meta Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get all complaints for the authenticated parent
     * GET /api/parent/complaints
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $status = $request->get('status');
            $type = $request->get('type');
            $schoolId = $request->get('school_id');

            $query = Complaint::with(['school:school_id,name', 'child:child_id,child_name'])
                ->where('parent_id', $user->user_id)
                ->orderByDesc('created_at');

            // Apply filters
            if ($status) {
                $query->where('status', $status);
            }

            if ($type) {
                $query->where('type', $type);
            }

            if ($schoolId) {
                $query->where('school_id', $schoolId);
            }

            $complaints = $query->get()
                ->map(function ($complaint) {
                    return [
                        'id' => $complaint->id,
                        'school_id' => $complaint->school_id,
                        'school_name' => $complaint->school->name ?? 'مدرسة',
                        'child_name' => $complaint->child->child_name ?? 'غير محدد',
                        'type' => $complaint->type,
                        'title' => $complaint->title,
                        'description' => $complaint->description,
                        'status' => $complaint->status,
                        'priority' => $complaint->priority,
                        'attachment_path' => $complaint->attachment_path,
                        'admin_response' => $complaint->admin_response,
                        'response_date' => $complaint->response_date?->toISOString(),
                        'created_at' => $complaint->created_at->toISOString(),
                        'updated_at' => $complaint->updated_at->toISOString(),
                    ];
                });

            // Statistics
            $totalComplaints = $complaints->count();
            $pendingComplaints = $complaints->where('status', 'pending')->count();
            $resolvedComplaints = $complaints->where('status', 'resolved')->count();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب الشكاوى بنجاح',
                'data' => [
                    'complaints' => $complaints,
                    'statistics' => [
                        'total' => $totalComplaints,
                        'pending' => $pendingComplaints,
                        'resolved' => $resolvedComplaints,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Complaints Index Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الشكاوى',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get specific complaint details
     * GET /api/parent/complaints/{id}
     */
    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $complaint = Complaint::with(['school:school_id,name,type', 'child:child_id,child_name,child_grade'])
                ->where('id', $id)
                ->where('parent_id', $user->user_id)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب تفاصيل الشكوى بنجاح',
                'data' => [
                    'complaint' => [
                        'id' => $complaint->id,
                        'school_id' => $complaint->school_id,
                        'school_name' => $complaint->school->name ?? 'مدرسة',
                        'child_name' => $complaint->child->child_name ?? 'غير محدد',
                        'child_grade' => $complaint->child->child_grade ?? 'غير محدد',
                        'type' => $complaint->type,
                        'title' => $complaint->title,
                        'description' => $complaint->description,
                        'status' => $complaint->status,
                        'priority' => $complaint->priority,
                        'attachment_path' => $complaint->attachment_path,
                        'admin_response' => $complaint->admin_response,
                        'response_date' => $complaint->response_date?->toISOString(),
                        'created_at' => $complaint->created_at->toISOString(),
                        'updated_at' => $complaint->updated_at->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Complaint Show Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب تفاصيل الشكوى',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Create a new complaint
     * POST /api/parent/complaints
     */
    public function store(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'school_id' => ['required', 'exists:schools,school_id'],
                'child_id' => ['required', 'exists:parent_children,child_id'],
                'type' => ['required', 'in:academic,behavior,transport,facility,teacher,administration,safety,other'],
                'title' => ['required', 'string', 'max:255'],
                'description' => ['required', 'string', 'min:10', 'max:2000'],
                'priority' => ['required', 'in:low,medium,high,urgent'],
                'attachment' => ['nullable', 'file', 'max:5120', 'mimes:jpg,jpeg,png,pdf,doc,docx'], // 5MB
            ], [
                'school_id.required' => 'المدرسة مطلوبة',
                'school_id.exists' => 'المدرسة غير موجودة',
                'child_id.required' => 'الطفل مطلوب',
                'child_id.exists' => 'الطفل غير موجود',
                'type.required' => 'نوع الشكوى مطلوب',
                'type.in' => 'نوع الشكوى غير صحيح',
                'title.required' => 'عنوان الشكوى مطلوب',
                'title.max' => 'عنوان الشكوى يجب ألا يتجاوز 255 حرف',
                'description.required' => 'وصف الشكوى مطلوب',
                'description.min' => 'وصف الشكوى يجب أن يكون至少 10 أحرف',
                'description.max' => 'وصف الشكوى يجب ألا يتجاوز 2000 حرف',
                'priority.required' => 'أولوية الشكوى مطلوبة',
                'priority.in' => 'أولوية الشكوى غير صحيحة',
                'attachment.max' => 'يجب ألا يتجاوز حجم الملف 5MB',
                'attachment.mimes' => 'نوع الملف غير مسموح به',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Verify that the child belongs to the parent and school
            $childExists = ParentChild::where('parent_id', $user->user_id)
                ->where('child_id', $request->child_id)
                ->where('school_id', $request->school_id)
                ->where('status', 'active')
                ->exists();

            if (!$childExists) {
                return response()->json([
                    'success' => false,
                    'message' => 'الطفل غير مرتبط بحسابك أو بهذه المدرسة'
                ], 422);
            }

            // Handle file upload
            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $filename = 'complaint_' . time() . '_' . $user->user_id . '.' . $file->getClientOriginalExtension();
                $attachmentPath = $file->storeAs('complaints', $filename, 'public');
            }

            // Create complaint
            $complaint = Complaint::create([
                'parent_id' => $user->user_id,
                'school_id' => $request->school_id,
                'child_id' => $request->child_id,
                'type' => $request->type,
                'title' => $request->title,
                'description' => $request->description,
                'priority' => $request->priority,
                'attachment_path' => $attachmentPath,
                'status' => 'pending',
            ]);

            // Log the complaint creation
            Log::info('New complaint created', [
                'complaint_id' => $complaint->id,
                'parent_id' => $user->user_id,
                'school_id' => $request->school_id,
                'type' => $request->type,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إرسال الشكوى بنجاح وسيتم مراجعتها من قبل الإدارة',
                'data' => [
                    'complaint_id' => $complaint->id
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Parent Complaint Store Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الشكوى',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Update a complaint (only allowed for pending complaints)
     * PUT /api/parent/complaints/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $complaint = Complaint::where('id', $id)
                ->where('parent_id', $user->user_id)
                ->where('status', 'pending') // Only allow updates for pending complaints
                ->firstOrFail();

            $validator = Validator::make($request->all(), [
                'title' => ['sometimes', 'string', 'max:255'],
                'description' => ['sometimes', 'string', 'min:10', 'max:2000'],
                'priority' => ['sometimes', 'in:low,medium,high,urgent'],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $complaint->update($request->only(['title', 'description', 'priority']));

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الشكوى بنجاح',
                'data' => [
                    'complaint_id' => $complaint->id
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Complaint Update Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الشكوى',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Cancel a complaint (only allowed for pending complaints)
     * DELETE /api/parent/complaints/{id}
     */
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $complaint = Complaint::where('id', $id)
                ->where('parent_id', $user->user_id)
                ->where('status', 'pending') // Only allow deletion for pending complaints
                ->firstOrFail();

            // Delete attachment if exists
            if ($complaint->attachment_path) {
                Storage::disk('public')->delete($complaint->attachment_path);
            }

            $complaint->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الشكوى بنجاح'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Complaint Delete Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الشكوى',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}