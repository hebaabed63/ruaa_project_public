<?php

namespace App\Http\Controllers\Api\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ParentCalendarEvent;
use App\Models\ParentChild;
use App\Models\School;
use App\Models\SchoolEvent;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ParentCalendarController extends Controller
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
     * Get calendar events for parent
     * GET /api/parent/calendar/events
     */
    public function getEvents(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'type' => 'nullable|in:all,personal,school,child',
            ], [
                'start_date.required' => 'تاريخ البداية مطلوب',
                'end_date.required' => 'تاريخ النهاية مطلوب',
                'end_date.after_or_equal' => 'تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);
            $type = $request->type ?? 'all';

            // Get parent's children schools
            $schoolIds = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->pluck('school_id')
                ->unique();

            $events = collect();

            // Personal events
            if ($type === 'all' || $type === 'personal') {
                $personalEvents = ParentCalendarEvent::where('parent_id', $user->user_id)
                    ->whereBetween('event_date', [$startDate, $endDate])
                    ->get()
                    ->map(function ($event) {
                        return [
                            'id' => 'personal_' . $event->id,
                            'title' => $event->title,
                            'description' => $event->description,
                            'start' => $event->event_date->toISOString(),
                            'end' => $event->event_date->copy()->addHours(1)->toISOString(),
                            'type' => 'personal',
                            'color' => '#3B82F6', // blue
                            'allDay' => true,
                            'reminder' => $event->reminder,
                            'location' => $event->location,
                            'created_at' => $event->created_at->toISOString(),
                        ];
                    });

                $events = $events->merge($personalEvents);
            }

            // School events
            if ($type === 'all' || $type === 'school') {
                $schoolEvents = SchoolEvent::whereIn('school_id', $schoolIds)
                    ->whereBetween('event_date', [$startDate, $endDate])
                    ->where('is_public', true)
                    ->with('school:school_id,name')
                    ->get()
                    ->map(function ($event) {
                        return [
                            'id' => 'school_' . $event->id,
                            'title' => $event->title . ' - ' . $event->school->name,
                            'description' => $event->description,
                            'start' => $event->event_date->toISOString(),
                            'end' => $event->end_date ? $event->end_date->toISOString() : $event->event_date->copy()->addHours(2)->toISOString(),
                            'type' => 'school',
                            'color' => '#10B981', // green
                            'allDay' => $event->is_all_day,
                            'school_id' => $event->school_id,
                            'school_name' => $event->school->name,
                            'location' => $event->location,
                            'created_at' => $event->created_at->toISOString(),
                        ];
                    });

                $events = $events->merge($schoolEvents);
            }

            // Child-specific events (like exams, parent meetings)
            if ($type === 'all' || $type === 'child') {
                $childEvents = DB::table('child_events')
                    ->whereIn('school_id', $schoolIds)
                    ->whereBetween('event_date', [$startDate, $endDate])
                    ->where('is_active', true)
                    ->get()
                    ->map(function ($event) {
                        return [
                            'id' => 'child_' . $event->id,
                            'title' => $event->title . ' - ' . $event->child_name,
                            'description' => $event->description,
                            'start' => Carbon::parse($event->event_date)->toISOString(),
                            'end' => $event->end_date ? Carbon::parse($event->end_date)->toISOString() : Carbon::parse($event->event_date)->addHours(1)->toISOString(),
                            'type' => 'child',
                            'color' => '#F59E0B', // amber
                            'allDay' => $event->is_all_day,
                            'child_name' => $event->child_name,
                            'child_grade' => $event->child_grade,
                            'location' => $event->location,
                        ];
                    });

                $events = $events->merge($childEvents);
            }

            // Sort events by start date
            $sortedEvents = $events->sortBy('start')->values();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب الأحداث بنجاح',
                'data' => [
                    'events' => $sortedEvents,
                    'total' => $sortedEvents->count(),
                    'date_range' => [
                        'start_date' => $startDate->toISOString(),
                        'end_date' => $endDate->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Calendar Events Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الأحداث',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Add personal calendar event
     * POST /api/parent/calendar/events
     */
    public function addEvent(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'event_date' => 'required|date',
                'reminder' => 'nullable|boolean',
                'reminder_minutes' => 'nullable|integer|min:0|max:10080', // max 7 days
                'location' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:7',
            ], [
                'title.required' => 'عنوان الحدث مطلوب',
                'title.max' => 'عنوان الحدث يجب ألا يتجاوز 255 حرف',
                'event_date.required' => 'تاريخ الحدث مطلوب',
                'event_date.date' => 'تاريخ الحدث غير صحيح',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $event = ParentCalendarEvent::create([
                'parent_id' => $user->user_id,
                'title' => $request->title,
                'description' => $request->description,
                'event_date' => Carbon::parse($request->event_date),
                'reminder' => $request->reminder ?? false,
                'reminder_minutes' => $request->reminder_minutes ?? 30,
                'location' => $request->location,
                'color' => $request->color ?? '#3B82F6',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة الحدث بنجاح',
                'data' => [
                    'event' => [
                        'id' => $event->id,
                        'title' => $event->title,
                        'description' => $event->description,
                        'event_date' => $event->event_date->toISOString(),
                        'reminder' => $event->reminder,
                        'reminder_minutes' => $event->reminder_minutes,
                        'location' => $event->location,
                        'color' => $event->color,
                        'created_at' => $event->created_at->toISOString(),
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Parent Add Calendar Event Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة الحدث',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Update personal calendar event
     * PUT /api/parent/calendar/events/{eventId}
     */
    public function updateEvent(Request $request, $eventId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $event = ParentCalendarEvent::where('parent_id', $user->user_id)
                ->where('id', $eventId)
                ->firstOrFail();

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string|max:1000',
                'event_date' => 'sometimes|date',
                'reminder' => 'nullable|boolean',
                'reminder_minutes' => 'nullable|integer|min:0|max:10080',
                'location' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:7',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل في التحقق من البيانات',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $event->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الحدث بنجاح',
                'data' => [
                    'event' => [
                        'id' => $event->id,
                        'title' => $event->title,
                        'description' => $event->description,
                        'event_date' => $event->event_date->toISOString(),
                        'reminder' => $event->reminder,
                        'reminder_minutes' => $event->reminder_minutes,
                        'location' => $event->location,
                        'color' => $event->color,
                        'updated_at' => $event->updated_at->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Update Calendar Event Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الحدث',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Delete personal calendar event
     * DELETE /api/parent/calendar/events/{eventId}
     */
    public function deleteEvent(Request $request, $eventId)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $event = ParentCalendarEvent::where('parent_id', $user->user_id)
                ->where('id', $eventId)
                ->firstOrFail();

            $event->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الحدث بنجاح'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Delete Calendar Event Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الحدث',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get upcoming events (next 7 days)
     * GET /api/parent/calendar/upcoming
     */
    public function getUpcomingEvents(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $startDate = now();
            $endDate = now()->addDays(7);

            // Get parent's children schools
            $schoolIds = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->pluck('school_id')
                ->unique();

            $upcomingEvents = collect();

            // Personal events
            $personalEvents = ParentCalendarEvent::where('parent_id', $user->user_id)
                ->whereBetween('event_date', [$startDate, $endDate])
                ->orderBy('event_date')
                ->limit(10)
                ->get()
                ->map(function ($event) {
                    return [
                        'id' => 'personal_' . $event->id,
                        'title' => $event->title,
                        'date' => $event->event_date->toISOString(),
                        'type' => 'personal',
                        'icon' => '📅',
                        'color' => 'blue',
                        'time_remaining' => $event->event_date->diffForHumans(),
                    ];
                });

            // School events
            $schoolEvents = SchoolEvent::whereIn('school_id', $schoolIds)
                ->whereBetween('event_date', [$startDate, $endDate])
                ->where('is_public', true)
                ->with('school:school_id,name')
                ->orderBy('event_date')
                ->limit(10)
                ->get()
                ->map(function ($event) {
                    return [
                        'id' => 'school_' . $event->id,
                        'title' => $event->title,
                        'date' => $event->event_date->toISOString(),
                        'type' => 'school',
                        'icon' => '🏫',
                        'color' => 'green',
                        'school_name' => $event->school->name,
                        'time_remaining' => $event->event_date->diffForHumans(),
                    ];
                });

            $upcomingEvents = $upcomingEvents->merge($personalEvents)->merge($schoolEvents);

            // Sort by date
            $sortedEvents = $upcomingEvents->sortBy('date')->values();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب الأحداث القادمة بنجاح',
                'data' => [
                    'events' => $sortedEvents,
                    'total' => $sortedEvents->count(),
                    'date_range' => [
                        'start_date' => $startDate->toISOString(),
                        'end_date' => $endDate->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Upcoming Events Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الأحداث القادمة',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get calendar statistics
     * GET /api/parent/calendar/statistics
     */
    public function getStatistics(Request $request)
    {
        try {
            $user = $request->user();
            $this->ensureParent($user);

            $startDate = now()->startOfMonth();
            $endDate = now()->endOfMonth();

            // Get parent's children schools
            $schoolIds = ParentChild::where('parent_id', $user->user_id)
                ->where('status', 'active')
                ->pluck('school_id')
                ->unique();

            // Personal events count
            $personalEventsCount = ParentCalendarEvent::where('parent_id', $user->user_id)
                ->whereBetween('event_date', [$startDate, $endDate])
                ->count();

            // School events count
            $schoolEventsCount = SchoolEvent::whereIn('school_id', $schoolIds)
                ->whereBetween('event_date', [$startDate, $endDate])
                ->where('is_public', true)
                ->count();

            // Today's events
            $todayEventsCount = ParentCalendarEvent::where('parent_id', $user->user_id)
                ->whereDate('event_date', today())
                ->count();

            $todayEventsCount += SchoolEvent::whereIn('school_id', $schoolIds)
                ->whereDate('event_date', today())
                ->where('is_public', true)
                ->count();

            // Upcoming events (next 3 days)
            $upcomingEventsCount = ParentCalendarEvent::where('parent_id', $user->user_id)
                ->whereBetween('event_date', [now(), now()->addDays(3)])
                ->count();

            $upcomingEventsCount += SchoolEvent::whereIn('school_id', $schoolIds)
                ->whereBetween('event_date', [now(), now()->addDays(3)])
                ->where('is_public', true)
                ->count();

            return response()->json([
                'success' => true,
                'message' => 'تم جلب إحصائيات التقويم بنجاح',
                'data' => [
                    'statistics' => [
                        'personal_events_this_month' => $personalEventsCount,
                        'school_events_this_month' => $schoolEventsCount,
                        'total_events_this_month' => $personalEventsCount + $schoolEventsCount,
                        'today_events' => $todayEventsCount,
                        'upcoming_events' => $upcomingEventsCount,
                    ],
                    'month' => now()->format('F Y'),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Parent Calendar Statistics Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب إحصائيات التقويم',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}