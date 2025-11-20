<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SupportTicket;
use App\Models\SupportCategory;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ParentSupportController extends Controller
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
     * Get support categories
     * GET /api/parent/support/categories
     */
    public function getCategories(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $categories = SupportCategory::where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'description' => $category->description,
                        'icon' => $category->icon,
                        'color' => $category->color,
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'تم جلب التصنيفات بنجاح',
                'data' => [
                    'categories' => $categories,
                    'total' => $categories->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Support Categories Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب التصنيفات',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get all support tickets for parent
     * GET /api/parent/support/tickets
     */
    public function getTickets(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $status = $request->get('status');
            $categoryId = $request->get('category_id');

            $query = SupportTicket::where('user_id', $user->user_id)
                ->with(['category:id,name,color', 'assignedAdmin:id,name'])
                ->orderBy('created_at', 'desc');

            if ($status) {
                $query->where('status', $status);
            }

            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }

            $tickets = $query->get()
                ->map(function ($ticket) {
                    return [
                        'id' => $ticket->id,
                        'ticket_number' => $ticket->ticket_number,
                        'subject' => $ticket->subject,
                        'category' => $ticket->category ? [
                            'id' => $ticket->category->id,
                            'name' => $ticket->category->name,
                            'color' => $ticket->category->color,
                        ] : null,
                        'status' => $ticket->status,
                        'priority' => $ticket->priority,
                        'assigned_admin' => $ticket->assignedAdmin ? [
                            'id' => $ticket->assignedAdmin->id,
                            'name' => $ticket->assignedAdmin->name,
                        ] : null,
                        'last_reply_at' => $ticket->last_reply_at?->toISOString(),
                        'created_at' => $ticket->created_at->toISOString(),
                        'updated_at' => $ticket->updated_at->toISOString(),
                    ];
                });

            // Statistics
            $totalTickets = $tickets->count();
            $openTickets = $tickets->where('status', 'open')->count();
            $inProgressTickets = $tickets->where('status', 'in_progress')->count();
            $resolvedTickets = $tickets->where('status', 'resolved')->count();
            $closedTickets = $tickets->where('status', 'closed')->count();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب تذاكر الدعم بنجاح',
                'data' => [
                    'tickets' => $tickets,
                    'statistics' => [
                        'total' => $totalTickets,
                        'open' => $openTickets,
                        'in_progress' => $inProgressTickets,
                        'resolved' => $resolvedTickets,
                        'closed' => $closedTickets,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Support Tickets Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب تذاكر الدعم',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get specific ticket details
     * GET /api/parent/support/tickets/{ticketId}
     */
    public function getTicketDetails(Request $request, $ticketId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $ticket = SupportTicket::where('id', $ticketId)
                ->where('user_id', $user->user_id)
                ->with([
                    'category:id,name,color',
                    'assignedAdmin:id,name,profile_image',
                    'replies' => function($query) {
                        $query->with('user:id,name,profile_image,role')
                              ->orderBy('created_at', 'asc');
                    }
                ])
                ->firstOrFail();

            $ticketData = [
                'id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'subject' => $ticket->subject,
                'description' => $ticket->description,
                'category' => $ticket->category ? [
                    'id' => $ticket->category->id,
                    'name' => $ticket->category->name,
                    'color' => $ticket->category->color,
                ] : null,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'assigned_admin' => $ticket->assignedAdmin ? [
                    'id' => $ticket->assignedAdmin->id,
                    'name' => $ticket->assignedAdmin->name,
                    'profile_image' => $ticket->assignedAdmin->profile_image,
                ] : null,
                'attachments' => $ticket->attachments ? json_decode($ticket->attachments, true) : [],
                'replies' => $ticket->replies->map(function ($reply) use ($user) {
                    return [
                        'id' => $reply->id,
                        'content' => $reply->content,
                        'user' => [
                            'id' => $reply->user->id,
                            'name' => $reply->user->name,
                            'profile_image' => $reply->user->profile_image,
                            'role' => $reply->user->role,
                            'is_own_reply' => $reply->user_id == $user->user_id,
                        ],
                        'attachments' => $reply->attachments ? json_decode($reply->attachments, true) : [],
                        'created_at' => $reply->created_at->toISOString(),
                    ];
                }),
                'created_at' => $ticket->created_at->toISOString(),
                'updated_at' => $ticket->updated_at->toISOString(),
                'last_reply_at' => $ticket->last_reply_at?->toISOString(),
            ];

            return response()->json([
                'success' => true,
                'message' => 'تم جلب تفاصيل التذكرة بنجاح',
                'data' => [
                    'ticket' => $ticketData
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Ticket Details Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب تفاصيل التذكرة',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Create a new support ticket
     * POST /api/parent/support/tickets
     */
    public function createTicket(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'category_id' => 'required|exists:support_categories,id',
                'subject' => 'required|string|max:255',
                'description' => 'required|string|min:10|max:2000',
                'priority' => 'required|in:low,medium,high,urgent',
                'attachments' => 'nullable|array',
                'attachments.*' => 'file|max:5120|mimes:jpg,jpeg,png,pdf,doc,docx,txt', // 5MB
            ], [
                'category_id.required' => 'التصنيف مطلوب',
                'category_id.exists' => 'التصنيف غير موجود',
                'subject.required' => 'عنوان التذكرة مطلوب',
                'subject.max' => 'عنوان التذكرة يجب ألا يتجاوز 255 حرف',
                'description.required' => 'وصف المشكلة مطلوب',
                'description.min' => 'وصف المشكلة يجب أن يكون至少 10 أحرف',
                'description.max' => 'وصف المشكلة يجب ألا يتجاوز 2000 حرف',
                'priority.required' => 'أولوية التذكرة مطلوبة',
                'priority.in' => 'أولوية التذكرة غير صحيحة',
                'attachments.*.max' => 'يجب ألا يتجاوز حجم الملف 5MB',
                'attachments.*.mimes' => 'نوع الملف غير مسموح به',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Generate ticket number
            $ticketNumber = 'TKT-' . strtoupper(uniqid());

            // Handle file uploads
            $attachments = [];
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $filename = 'ticket_' . time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('support/tickets', $filename, 'public');
                    $attachments[] = [
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'size' => $file->getSize(),
                    ];
                }
            }

            $ticket = SupportTicket::create([
                'ticket_number' => $ticketNumber,
                'user_id' => $user->user_id,
                'category_id' => $request->category_id,
                'subject' => $request->subject,
                'description' => $request->description,
                'priority' => $request->priority,
                'status' => 'open',
                'attachments' => !empty($attachments) ? json_encode($attachments) : null,
            ]);

            Log::info('New support ticket created', [
                'ticket_id' => $ticket->id,
                'ticket_number' => $ticketNumber,
                'user_id' => $user->user_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء تذكرة الدعم بنجاح',
                'data' => [
                    'ticket' => [
                        'id' => $ticket->id,
                        'ticket_number' => $ticket->ticket_number,
                        'subject' => $ticket->subject,
                        'status' => $ticket->status,
                        'priority' => $ticket->priority,
                        'created_at' => $ticket->created_at->toISOString(),
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Parent Create Ticket Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء تذكرة الدعم',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Add reply to ticket
     * POST /api/parent/support/tickets/{ticketId}/reply
     */
    public function addReply(Request $request, $ticketId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $ticket = SupportTicket::where('id', $ticketId)
                ->where('user_id', $user->user_id)
                ->firstOrFail();

            // Check if ticket is closed
            if ($ticket->status === 'closed') {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن الرد على تذكرة مغلقة'
                ], 422);
            }

            $validator = Validator::make($request->all(), [
                'content' => 'required|string|min:5|max:2000',
                'attachments' => 'nullable|array',
                'attachments.*' => 'file|max:5120|mimes:jpg,jpeg,png,pdf,doc,docx,txt',
            ], [
                'content.required' => 'محتوى الرد مطلوب',
                'content.min' => 'محتوى الرد يجب أن يكون至少 5 أحرف',
                'content.max' => 'محتوى الرد يجب ألا يتجاوز 2000 حرف',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Handle file uploads
            $attachments = [];
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $filename = 'reply_' . time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('support/replies', $filename, 'public');
                    $attachments[] = [
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'size' => $file->getSize(),
                    ];
                }
            }

            // Create reply
            $reply = $ticket->replies()->create([
                'user_id' => $user->user_id,
                'content' => $request->content,
                'attachments' => !empty($attachments) ? json_encode($attachments) : null,
            ]);

            // Update ticket
            $ticket->update([
                'last_reply_at' => now(),
                'updated_at' => now(),
            ]);

            // If ticket was resolved and user replies, reopen it
            if ($ticket->status === 'resolved') {
                $ticket->update(['status' => 'in_progress']);
            }

            // Load user relationship for response
            $reply->load('user:id,name,profile_image,role');

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة الرد بنجاح',
                'data' => [
                    'reply' => [
                        'id' => $reply->id,
                        'content' => $reply->content,
                        'user' => [
                            'id' => $reply->user->id,
                            'name' => $reply->user->name,
                            'profile_image' => $reply->user->profile_image,
                            'role' => $reply->user->role,
                            'is_own_reply' => true,
                        ],
                        'attachments' => $reply->attachments ? json_decode($reply->attachments, true) : [],
                        'created_at' => $reply->created_at->toISOString(),
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Parent Add Reply Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة الرد',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Close a ticket
     * PUT /api/parent/support/tickets/{ticketId}/close
     */
    public function closeTicket(Request $request, $ticketId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $ticket = SupportTicket::where('id', $ticketId)
                ->where('user_id', $user->user_id)
                ->firstOrFail();

            if ($ticket->status === 'closed') {
                return response()->json([
                    'success' => false,
                    'message' => 'التذكرة مغلقة already'
                ], 422);
            }

            $ticket->update([
                'status' => 'closed',
                'closed_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إغلاق التذكرة بنجاح',
                'data' => [
                    'ticket' => [
                        'id' => $ticket->id,
                        'ticket_number' => $ticket->ticket_number,
                        'status' => $ticket->status,
                        'closed_at' => $ticket->closed_at->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Close Ticket Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إغلاق التذكرة',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Reopen a closed ticket
     * PUT /api/parent/support/tickets/{ticketId}/reopen
     */
    public function reopenTicket(Request $request, $ticketId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $ticket = SupportTicket::where('id', $ticketId)
                ->where('user_id', $user->user_id)
                ->firstOrFail();

            if ($ticket->status !== 'closed') {
                return response()->json([
                    'success' => false,
                    'message' => 'يمكن إعادة فتح التذاكر المغلقة only'
                ], 422);
            }

            $ticket->update([
                'status' => 'open',
                'closed_at' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إعادة فتح التذكرة بنجاح',
                'data' => [
                    'ticket' => [
                        'id' => $ticket->id,
                        'ticket_number' => $ticket->ticket_number,
                        'status' => $ticket->status,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Reopen Ticket Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إعادة فتح التذكرة',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get support statistics
     * GET /api/parent/support/statistics
     */
    public function getStatistics(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $totalTickets = SupportTicket::where('user_id', $user->user_id)->count();
            $openTickets = SupportTicket::where('user_id', $user->user_id)->where('status', 'open')->count();
            $inProgressTickets = SupportTicket::where('user_id', $user->user_id)->where('status', 'in_progress')->count();
            $resolvedTickets = SupportTicket::where('user_id', $user->user_id)->where('status', 'resolved')->count();
            $closedTickets = SupportTicket::where('user_id', $user->user_id)->where('status', 'closed')->count();

            // Average response time (in hours)
            $avgResponseTime = SupportTicket::where('user_id', $user->user_id)
                ->whereNotNull('first_response_at')
                ->avg(DB::raw('TIMESTAMPDIFF(HOUR, created_at, first_response_at)'));

            // Recent activity
            $recentTickets = SupportTicket::where('user_id', $user->user_id)
                ->orderBy('updated_at', 'desc')
                ->limit(5)
                ->get(['id', 'ticket_number', 'subject', 'status', 'updated_at']);

            return response()->json([
                'success' => true,
                'message' => 'تم جلب إحصائيات الدعم بنجاح',
                'data' => [
                    'statistics' => [
                        'total_tickets' => $totalTickets,
                        'open_tickets' => $openTickets,
                        'in_progress_tickets' => $inProgressTickets,
                        'resolved_tickets' => $resolvedTickets,
                        'closed_tickets' => $closedTickets,
                        'avg_response_time_hours' => round($avgResponseTime ?? 0, 1),
                        'satisfaction_rate' => null, // You can add satisfaction ratings later
                    ],
                    'recent_activity' => $recentTickets,
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Support Statistics Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب إحصائيات الدعم',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}