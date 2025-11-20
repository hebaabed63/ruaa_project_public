<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SupportTicket;
use App\Models\User;

class AdminSupportController extends Controller
{
    /**
     * Get all support tickets (for admin)
     */
    public function getAllSupportTickets(Request $request)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            $tickets = SupportTicket::with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($ticket) {
                    return [
                        'ticket_id' => $ticket->ticket_id,
                        'title' => $ticket->title,
                        'user_name' => $ticket->user->name,
                        'user_email' => $ticket->user->email,
                        'priority' => $ticket->priority,
                        'status' => $ticket->status,
                        'created_at' => $ticket->created_at,
                        'updated_at' => $ticket->updated_at
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $tickets,
                'message' => 'تم جلب تذاكر الدعم بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تذاكر الدعم: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get support ticket by ID (for admin)
     */
    public function getSupportTicketById(Request $request, $ticketId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بالوصول لهذه البيانات'
                ], 403);
            }

            $ticket = SupportTicket::with('user')
                ->where('ticket_id', $ticketId)
                ->first();

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'التذكرة غير موجودة'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'ticket_id' => $ticket->ticket_id,
                    'title' => $ticket->title,
                    'description' => $ticket->description,
                    'user_name' => $ticket->user->name,
                    'user_email' => $ticket->user->email,
                    'priority' => $ticket->priority,
                    'status' => $ticket->status,
                    'attachment_url' => $ticket->attachment_url,
                    'created_at' => $ticket->created_at,
                    'updated_at' => $ticket->updated_at
                ],
                'message' => 'تم جلب تفاصيل التذكرة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب تفاصيل التذكرة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update support ticket status (for admin)
     */
    public function updateSupportTicketStatus(Request $request, $ticketId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بتحديث حالة تذاكر الدعم'
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:open,in_progress,resolved,closed'
            ]);

            $ticket = SupportTicket::find($ticketId);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'التذكرة غير موجودة'
                ], 404);
            }

            $ticket->status = $validated['status'];
            $ticket->save();

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة التذكرة بنجاح',
                'data' => $ticket
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث حالة التذكرة: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete support ticket (for admin)
     */
    public function deleteSupportTicket(Request $request, $ticketId)
    {
        try {
            // التحقق من أن المستخدم أدمين
            if ($request->user()->role !== 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مسموح لك بحذف تذاكر الدعم'
                ], 403);
            }

            $ticket = SupportTicket::find($ticketId);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'التذكرة غير موجودة'
                ], 404);
            }

            $ticket->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف التذكرة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف التذكرة: ' . $e->getMessage()
            ], 500);
        }
    }
}