<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ParentChild;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class ParentProfileController extends Controller
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
     * Get parent profile with children and schools
     * GET /api/parent/profile
     */
    public function show(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $profileData = $this->mapParentProfile($user);

            return response()->json([
                'success' => true,
                'message' => 'تم جلب الملف الشخصي بنجاح',
                'data' => $profileData,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching parent profile: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'فشل في جلب بيانات الملف الشخصي',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update parent profile
     * PUT /api/parent/profile
     */
    public function update(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'fullName' => 'required|string|min:3|max:50',
                'phone' => ['required', 'string', 'regex:/^[+]?[0-9]{10,15}$/'],
                'address' => 'required|string|min:5|max:200',
            ], [
                'fullName.required' => 'الاسم الكامل مطلوب',
                'fullName.min' => 'الاسم الكامل يجب أن يكون على الأقل 3 أحرف',
                'fullName.max' => 'الاسم الكامل يجب ألا يتجاوز 50 حرف',
                'phone.required' => 'رقم الهاتف مطلوب',
                'phone.regex' => 'صيغة رقم الهاتف غير صحيحة. يجب أن يكون 10-15 رقماً',
                'address.required' => 'العنوان مطلوب',
                'address.min' => 'العنوان يجب أن يكون على الأقل 5 أحرف',
                'address.max' => 'العنوان يجب ألا يتجاوز 200 حرف',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Update user profile
            $user->name = $request->input('fullName');
            $user->phone = $request->input('phone');
            $user->address = $request->input('address');
            $user->save();

            // Return updated profile
            $profileData = $this->mapParentProfile($user->fresh());
            
            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الملف الشخصي بنجاح',
                'data' => $profileData,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating parent profile: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'فشل في تحديث الملف الشخصي',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update parent profile avatar/image
     * POST /api/parent/profile/avatar
     */
    public function updateAvatar(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'avatar' => [
                    'required',
                    'image',
                    'mimes:jpg,jpeg,png,webp',
                    'max:5120', // 5MB
                    'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000'
                ],
            ], [
                'avatar.required' => 'صورة الملف الشخصي مطلوبة',
                'avatar.image' => 'يجب أن يكون الملف صورة',
                'avatar.mimes' => 'يجب أن تكون الصورة من نوع: jpg, jpeg, png, webp',
                'avatar.max' => 'يجب ألا تتجاوز حجم الصورة 5MB',
                'avatar.dimensions' => 'يجب أن تكون أبعاد الصورة بين 100x100 و 2000x2000 بكسل',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Delete old avatar if exists
            if ($user->profile_image) {
                $oldPath = str_replace('/storage/', '', parse_url($user->profile_image, PHP_URL_PATH));
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Store new avatar
            $file = $request->file('avatar');
            $timestamp = time();
            $extension = $file->getClientOriginalExtension();
            $filename = "parent_{$user->user_id}_{$timestamp}.{$extension}";
            
            $path = $file->storeAs('avatars', $filename, 'public');

            // Update user profile_image with full URL
            $imageUrl = asset('storage/' . $path);
            $user->profile_image = $imageUrl;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Avatar updated successfully.',
                'data' => [
                    'profileImage' => $imageUrl,
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating avatar: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'فشل في تحديث صورة الملف الشخصي',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Change parent password
     * PUT /api/parent/profile/password
     */
    public function changePassword(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string|min:6',
                'new_password' => 'required|string|min:6|different:current_password',
                'confirm_password' => 'required|string|same:new_password',
            ], [
                'current_password.required' => 'كلمة المرور الحالية مطلوبة',
                'current_password.min' => 'كلمة المرور الحالية يجب أن تكون 6 أحرف على الأقل',
                'new_password.required' => 'كلمة المرور الجديدة مطلوبة',
                'new_password.min' => 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
                'new_password.different' => 'كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية',
                'confirm_password.required' => 'تأكيد كلمة المرور مطلوب',
                'confirm_password.same' => 'كلمة المرور الجديدة وتأكيدها غير متطابقتين',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'كلمة المرور الحالية غير صحيحة',
                    'errors' => [
                        'current_password' => ['كلمة المرور الحالية غير صحيحة']
                    ],
                ], 422);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            Log::info('Password changed successfully', ['user_id' => $user->user_id]);

            return response()->json([
                'success' => true,
                'message' => 'تم تغيير كلمة المرور بنجاح',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error changing password: ' . $e->getMessage(), [
                'user_id' => $request->user()?->user_id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تغيير كلمة المرور',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Map User model to parent profile array structure
     */
    private function mapParentProfile(User $user): array
    {
        // Get children with their schools
        $children = ParentChild::where('parent_id', $user->user_id)
            ->where('status', 'active')
            ->with(['school' => function($query) {
                $query->select('school_id', 'name', 'type', 'location', 'region');
            }])
            ->get()
            ->map(function ($child) {
                $school = $child->school;
                
                return [
                    'id' => $child->child_id,
                    'name' => $child->child_name,
                    'grade' => $child->child_grade,
                    'section' => $child->child_section,
                    'school' => $school ? [
                        'id' => $school->school_id,
                        'name' => $school->name ?? 'مدرسة غير معروفة',
                        'type' => $school->type ?? 'غير محدد',
                        'location' => $school->location ?? '',
                        'region' => $school->region ?? '',
                    ] : null,
                ];
            })
            ->toArray();

        return [
            'fullName' => $user->name ?? 'ولي الأمر',
            'name' => $user->name ?? 'ولي الأمر',
            'email' => $user->email ?? '',
            'phone' => $user->phone ?? '',
            'address' => $user->address ?? '',
            'profileImage' => $user->profile_image ?? null,
            'children' => $children,
            'joined_at' => $user->created_at?->format('Y-m-d'),
        ];
    }
}