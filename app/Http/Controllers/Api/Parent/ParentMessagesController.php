<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Conversation;
use App\Models\User;
use App\Models\School;
use App\Models\ParentChild;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ParentMessagesController extends Controller
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
     * Get all conversations for the parent
     * GET /api/parent/messages/conversations
     */
    public function getConversations(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $conversations = Conversation::where(function($query) use ($user) {
                    $query->where('user1_id', $user->user_id)
                          ->orWhere('user2_id', $user->user_id);
                })
                ->with(['user1:id,name,profile_image', 'user2:id,name,profile_image', 'lastMessage'])
                ->withCount(['messages as unread_count' => function($query) use ($user) {
                    $query->where('receiver_id', $user->user_id)
                          ->where('is_read', false);
                }])
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($conversation) use ($user) {
                    $otherUser = $conversation->user1_id == $user->user_id ? $conversation->user2 : $conversation->user1;
                    
                    return [
                        'id' => $conversation->id,
                        'other_user' => [
                            'id' => $otherUser->id,
                            'name' => $otherUser->name,
                            'profile_image' => $otherUser->profile_image,
                            'role' => $otherUser->role, // 1=admin, 2=supervisor, 3=parent, 4=teacher, etc.
                        ],
                        'last_message' => $conversation->lastMessage ? [
                            'content' => $conversation->lastMessage->content,
                            'created_at' => $conversation->lastMessage->created_at->toISOString(),
                            'is_read' => $conversation->lastMessage->is_read,
                        ] : null,
                        'unread_count' => $conversation->unread_count,
                        'updated_at' => $conversation->updated_at->toISOString(),
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'تم جلب المحادثات بنجاح',
                'data' => [
                    'conversations' => $conversations,
                    'total' => $conversations->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Conversations Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المحادثات',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get messages for a specific conversation
     * GET /api/parent/messages/conversations/{conversationId}
     */
    public function getConversationMessages(Request $request, $conversationId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // Verify the conversation belongs to the user
            $conversation = Conversation::where('id', $conversationId)
                ->where(function($query) use ($user) {
                    $query->where('user1_id', $user->user_id)
                          ->orWhere('user2_id', $user->user_id);
                })
                ->firstOrFail();

            $messages = Message::where('conversation_id', $conversationId)
                ->with(['sender:id,name,profile_image', 'receiver:id,name,profile_image'])
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($message) use ($user) {
                    return [
                        'id' => $message->id,
                        'content' => $message->content,
                        'sender_id' => $message->sender_id,
                        'sender_name' => $message->sender->name,
                        'sender_profile_image' => $message->sender->profile_image,
                        'receiver_id' => $message->receiver_id,
                        'receiver_name' => $message->receiver->name,
                        'is_read' => $message->is_read,
                        'is_own_message' => $message->sender_id == $user->user_id,
                        'created_at' => $message->created_at->toISOString(),
                        'updated_at' => $message->updated_at->toISOString(),
                    ];
                });

            // Mark messages as read
            Message::where('conversation_id', $conversationId)
                ->where('receiver_id', $user->user_id)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'تم جلب الرسائل بنجاح',
                'data' => [
                    'conversation_id' => $conversationId,
                    'messages' => $messages,
                    'total' => $messages->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Conversation Messages Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الرسائل',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Send a new message
     * POST /api/parent/messages/send
     */
    public function sendMessage(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'receiver_id' => 'required|exists:users,user_id',
                'content' => 'required|string|max:1000',
                'conversation_id' => 'nullable|exists:conversations,id',
            ], [
                'receiver_id.required' => 'المستلم مطلوب',
                'receiver_id.exists' => 'المستلم غير موجود',
                'content.required' => 'محتوى الرسالة مطلوب',
                'content.max' => 'محتوى الرسالة يجب ألا يتجاوز 1000 حرف',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            DB::beginTransaction();

            try {
                // Find or create conversation
                if ($request->conversation_id) {
                    $conversation = Conversation::where('id', $request->conversation_id)
                        ->where(function($query) use ($user) {
                            $query->where('user1_id', $user->user_id)
                                  ->orWhere('user2_id', $user->user_id);
                        })
                        ->firstOrFail();
                } else {
                    $conversation = Conversation::firstOrCreate(
                        [
                            'user1_id' => min($user->user_id, $request->receiver_id),
                            'user2_id' => max($user->user_id, $request->receiver_id),
                        ],
                        [
                            'last_message_at' => now(),
                        ]
                    );
                }

                // Create message
                $message = Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $user->user_id,
                    'receiver_id' => $request->receiver_id,
                    'content' => $request->content,
                    'is_read' => false,
                ]);

                // Update conversation last message timestamp
                $conversation->update([
                    'last_message_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::commit();

                // Load relationships for response
                $message->load(['sender:id,name,profile_image', 'receiver:id,name,profile_image']);

                return response()->json([
                    'success' => true,
                    'message' => 'تم إرسال الرسالة بنجاح',
                    'data' => [
                        'message' => [
                            'id' => $message->id,
                            'content' => $message->content,
                            'sender_id' => $message->sender_id,
                            'sender_name' => $message->sender->name,
                            'sender_profile_image' => $message->sender->profile_image,
                            'receiver_id' => $message->receiver_id,
                            'receiver_name' => $message->receiver->name,
                            'is_read' => $message->is_read,
                            'is_own_message' => true,
                            'created_at' => $message->created_at->toISOString(),
                        ],
                        'conversation_id' => $conversation->id,
                    ]
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Parent Send Message Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الرسالة',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get available contacts for messaging
     * GET /api/parent/messages/contacts
     */
    public function getContacts(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // Get schools where parent has children
            $schoolIds = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->pluck('school_id')
                ->unique();

            // Get school administrators and teachers
            $contacts = User::where(function($query) use ($schoolIds) {
                    // School managers
                    $query->whereHas('managedSchools', function($q) use ($schoolIds) {
                        $q->whereIn('schools.school_id', $schoolIds);
                    })
                    // Teachers (you might have a different relationship)
                    ->orWhereHas('taughtSchools', function($q) use ($schoolIds) {
                        $q->whereIn('schools.school_id', $schoolIds);
                    })
                    // System administrators
                    ->orWhere('role', 1); // admin role
                })
                ->where('user_id', '!=', $user->user_id)
                ->where('status', 'active')
                ->select('user_id', 'name', 'profile_image', 'role', 'email')
                ->get()
                ->map(function ($contact) {
                    $roleLabels = [
                        1 => 'مسؤول النظام',
                        2 => 'مشرف',
                        3 => 'ولي أمر',
                        4 => 'معلم',
                        5 => 'مدير مدرسة',
                    ];

                    return [
                        'id' => $contact->user_id,
                        'name' => $contact->name,
                        'profile_image' => $contact->profile_image,
                        'role' => $contact->role,
                        'role_label' => $roleLabels[$contact->role] ?? 'مستخدم',
                        'email' => $contact->email,
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'تم جلب جهات الاتصال بنجاح',
                'data' => [
                    'contacts' => $contacts,
                    'total' => $contacts->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Contacts Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب جهات الاتصال',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Mark conversation messages as read
     * PUT /api/parent/messages/conversations/{conversationId}/read
     */
    public function markAsRead(Request $request, $conversationId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            // Verify the conversation belongs to the user
            $conversation = Conversation::where('id', $conversationId)
                ->where(function($query) use ($user) {
                    $query->where('user1_id', $user->user_id)
                          ->orWhere('user2_id', $user->user_id);
                })
                ->firstOrFail();

            $updated = Message::where('conversation_id', $conversationId)
                ->where('receiver_id', $user->user_id)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد الرسائل كمقروءة',
                'data' => [
                    'conversation_id' => $conversationId,
                    'marked_read_count' => $updated,
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Mark Messages Read Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديد الرسائل كمقروءة',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get unread messages count
     * GET /api/parent/messages/unread-count
     */
    public function getUnreadCount(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $unreadCount = Message::where('receiver_id', $user->user_id)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب عدد الرسائل غير المقروءة',
                'data' => [
                    'unread_count' => $unreadCount,
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Unread Count Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب عدد الرسائل غير المقروءة',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Delete a message (only own messages)
     * DELETE /api/parent/messages/{messageId}
     */
    public function deleteMessage(Request $request, $messageId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $message = Message::where('id', $messageId)
                ->where('sender_id', $user->user_id)
                ->firstOrFail();

            $message->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الرسالة بنجاح'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Delete Message Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الرسالة',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}