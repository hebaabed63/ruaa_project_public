<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\public\SchoolController as ApiSchoolController;
use App\Http\Controllers\Api\public\AboutController;
use App\Http\Controllers\Api\public\ContactController;
use App\Http\Controllers\Api\public\RatingController;
use App\Http\Controllers\Api\public\ServiceController;
use App\Http\Controllers\Api\public\FeedbackController;

// Parent Controllers
use App\Http\Controllers\Api\Parent\ParentDashboardController;
use App\Http\Controllers\Api\Parent\ParentReportsController;
use App\Http\Controllers\Api\Parent\ParentComplaintsController;
use App\Http\Controllers\Api\Parent\ParentProfileController;
use App\Http\Controllers\Api\Parent\ParentSettingsController;
use App\Http\Controllers\Api\Parent\SchoolEvaluationController;
use App\Http\Controllers\Api\Parent\ParentChildrenController;
use App\Http\Controllers\Api\Parent\ParentMessagesController;
use App\Http\Controllers\Api\Parent\ParentCalendarController;
use App\Http\Controllers\Api\Parent\ParentSupportController;

// Supervisor Controllers (المقسمة)
use App\Http\Controllers\Api\Supervisor\SupervisorDashboardController;
use App\Http\Controllers\Api\Supervisor\SupervisorSchoolsController;
use App\Http\Controllers\Api\Supervisor\SupervisorProfileController;
use App\Http\Controllers\Api\Supervisor\SupervisorReportsController;
use App\Http\Controllers\Api\Supervisor\SupervisorInvitationsController;
use App\Http\Controllers\Api\Supervisor\SupervisorPrincipalsController;

// Admin Controllers
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminSchoolsController;
use App\Http\Controllers\Api\Admin\AdminReportsController;
use App\Http\Controllers\Api\Admin\AdminInvitationsController;
use App\Http\Controllers\Api\Admin\AdminProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ============================================================================
// Authentication Routes
// ============================================================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password/{token}', [AuthController::class, 'resetPassword']);

    // Google OAuth routes
    Route::get('/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [AuthController::class, 'handleGoogleCallback']);
    Route::post('/google/login', [AuthController::class, 'loginWithGoogle']);
    
    // Invitation token validation
    Route::get('/validate-token/{token}', [AuthController::class, 'validateInvitationToken']);
});

// معلومات المستخدم الحالي
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();
    $roleNames = [
        0 => 'admin',
        1 => 'supervisor',
        2 => 'school_manager',
        3 => 'parent'
    ];

    return response()->json([
        'success' => true,
        'data' => [
            'user' => $user,
            'role' => $roleNames[$user->role] ?? 'parent'
        ]
    ]);
});

// ============================================================================
// Public API Routes - متاحة للجميع
// ============================================================================

// Schools API Routes
Route::prefix('schools')->group(function () {
    Route::get('/', [ApiSchoolController::class, 'index']);
    Route::get('/best', [ApiSchoolController::class, 'best']);
    Route::get('/recent', [ApiSchoolController::class, 'recent']);
    Route::get('/search', [ApiSchoolController::class, 'search']);
    Route::get('/by-region', [ApiSchoolController::class, 'byRegion']);
    Route::get('/regions', [ApiSchoolController::class, 'regions']);
    Route::get('/{id}', [ApiSchoolController::class, 'show']);
    Route::get('/statistics', [ApiSchoolController::class, 'getStatistics']);
    Route::get('/best-schools', [ApiSchoolController::class, 'getBestSchools']);
});

// Statistics API Routes
Route::prefix('statistics')->group(function () {
    Route::get('/general', [ApiSchoolController::class, 'statistics']);
});

// Contact Routes
Route::prefix('contact')->group(function () {
    Route::get('/info', [ContactController::class, 'getContactInfo']);
    Route::post('/', [ContactController::class, 'store']);
});

// Ratings & Reviews
Route::prefix('ratings')->group(function () {
    Route::get('/criteria', [RatingController::class, 'getEvaluationCriteria']);
    Route::get('/school/{schoolId}', [RatingController::class, 'getSchoolRatings']);

    // Protected - تحتاج تسجيل دخول
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [RatingController::class, 'store']);
    });
});

// Feedback Routes
Route::prefix('feedback')->group(function () {
    Route::post('/', [FeedbackController::class, 'store']);
    Route::get('/', [FeedbackController::class, 'index']);
});

// ============================================================================
// Parent Dashboard API Routes - Protected
// ============================================================================
Route::prefix('parent')->middleware(['auth:sanctum', 'role:3'])->group(function () {
    
    // Dashboard - لوحة التحكم
    Route::get('/dashboard', [ParentDashboardController::class, 'index']);
    
    // Profile - الملف الشخصي
    Route::get('/profile', [ParentProfileController::class, 'show']);
    Route::put('/profile', [ParentProfileController::class, 'update']);
    Route::post('/profile/avatar', [ParentProfileController::class, 'updateAvatar']);
    Route::put('/profile/password', [ParentProfileController::class, 'changePassword']);
    
    // Settings - الإعدادات
    Route::get('/settings', [ParentSettingsController::class, 'getSettings']);
    Route::post('/settings/change-password', [ParentSettingsController::class, 'changePassword']);
    Route::put('/settings/notifications', [ParentSettingsController::class, 'updateNotificationSettings']);
    Route::put('/settings/privacy', [ParentSettingsController::class, 'updatePrivacySettings']);
    Route::put('/settings/preferences', [ParentSettingsController::class, 'updatePreferences']);
    
    // Schools - المدارس
    Route::get('/schools', [ParentDashboardController::class, 'getSchools']);
    Route::get('/schools/{id}', [ParentDashboardController::class, 'getSchoolDetails']);
    Route::post('/schools/{id}/rate', [ParentDashboardController::class, 'rateSchool']);
    
    // School Evaluations - تقييم المدارس
    Route::get('/evaluation-criteria', [SchoolEvaluationController::class, 'getCriteria']);
    Route::get('/schools/{schoolId}/evaluation', [SchoolEvaluationController::class, 'getSchoolEvaluation']);
    Route::post('/schools/{schoolId}/evaluation', [SchoolEvaluationController::class, 'submitEvaluation']);
    Route::get('/evaluations/history', [SchoolEvaluationController::class, 'getEvaluationHistory']);
    Route::get('/evaluations/statistics', [SchoolEvaluationController::class, 'getEvaluationStatistics']);
    Route::get('/evaluations/{evaluationId}', [SchoolEvaluationController::class, 'getEvaluationDetails']);
    Route::put('/evaluations/{evaluationId}', [SchoolEvaluationController::class, 'updateEvaluation']);
    Route::delete('/evaluations/{evaluationId}', [SchoolEvaluationController::class, 'deleteEvaluation']);
    Route::get('/schools/{schoolId}/evaluation/check', [SchoolEvaluationController::class, 'checkEvaluationEligibility']);
    
    // Children - الأبناء
    Route::get('/children', [ParentChildrenController::class, 'index']);
    Route::get('/children/{id}', [ParentChildrenController::class, 'show']);
    Route::post('/children', [ParentChildrenController::class, 'store']);
    Route::put('/children/{id}', [ParentChildrenController::class, 'update']);
    Route::delete('/children/{id}', [ParentChildrenController::class, 'destroy']);
    Route::get('/children/statistics', [ParentChildrenController::class, 'getStatistics']);
    
    // Notifications - الإشعارات
    Route::get('/notifications', [ParentDashboardController::class, 'getNotifications']);
    Route::put('/notifications/{id}/read', [ParentDashboardController::class, 'markNotificationAsRead']);
    Route::put('/notifications/mark-all-read', [ParentDashboardController::class, 'markAllNotificationsAsRead']);
    
    // Reports - التقارير
    Route::get('/reports', [ParentReportsController::class, 'index']);
    Route::get('/reports/available', [ParentReportsController::class, 'getAvailableReports']);
    Route::get('/reports/summary', [ParentReportsController::class, 'getReportsSummary']);
    Route::get('/reports/{id}/download', [ParentReportsController::class, 'downloadReport']);
    
    // Complaints - الشكاوى
    Route::get('/complaints/meta', [ParentComplaintsController::class, 'meta']);
    Route::get('/complaints', [ParentComplaintsController::class, 'index']);
    Route::get('/complaints/{id}', [ParentComplaintsController::class, 'show']);
    Route::post('/complaints', [ParentComplaintsController::class, 'store']);
    Route::put('/complaints/{id}', [ParentComplaintsController::class, 'update']);
    Route::delete('/complaints/{id}', [ParentComplaintsController::class, 'destroy']);
    
    // Messages - الرسائل
    Route::get('/messages/conversations', [ParentMessagesController::class, 'getConversations']);
    Route::get('/messages/conversations/{conversationId}', [ParentMessagesController::class, 'getConversationMessages']);
    Route::post('/messages/send', [ParentMessagesController::class, 'sendMessage']);
    Route::get('/messages/contacts', [ParentMessagesController::class, 'getContacts']);
    Route::put('/messages/conversations/{conversationId}/read', [ParentMessagesController::class, 'markAsRead']);
    Route::get('/messages/unread-count', [ParentMessagesController::class, 'getUnreadCount']);
    Route::delete('/messages/{messageId}', [ParentMessagesController::class, 'deleteMessage']);
    
    // Calendar - التقويم
    Route::get('/calendar/events', [ParentCalendarController::class, 'getEvents']);
    Route::post('/calendar/events', [ParentCalendarController::class, 'addEvent']);
    Route::put('/calendar/events/{eventId}', [ParentCalendarController::class, 'updateEvent']);
    Route::delete('/calendar/events/{eventId}', [ParentCalendarController::class, 'deleteEvent']);
    Route::get('/calendar/upcoming', [ParentCalendarController::class, 'getUpcomingEvents']);
    Route::get('/calendar/statistics', [ParentCalendarController::class, 'getStatistics']);
    
    // Support - الدعم الفني
    Route::get('/support/categories', [ParentSupportController::class, 'getCategories']);
    Route::get('/support/tickets', [ParentSupportController::class, 'getTickets']);
    Route::get('/support/tickets/{ticketId}', [ParentSupportController::class, 'getTicketDetails']);
    Route::post('/support/tickets', [ParentSupportController::class, 'createTicket']);
    Route::post('/support/tickets/{ticketId}/reply', [ParentSupportController::class, 'addReply']);
    Route::put('/support/tickets/{ticketId}/close', [ParentSupportController::class, 'closeTicket']);
    Route::put('/support/tickets/{ticketId}/reopen', [ParentSupportController::class, 'reopenTicket']);
    Route::get('/support/statistics', [ParentSupportController::class, 'getStatistics']);
});

// ============================================================================
// Supervisor Dashboard API Routes - Protected
// ============================================================================
Route::prefix('supervisor')->middleware(['auth:sanctum', 'role:1'])->group(function () {
    
    // Dashboard - لوحة التحكم
    Route::get('/dashboard/stats', [SupervisorDashboardController::class, 'getDashboardStats']);
    Route::get('/dashboard/charts/evaluations', [SupervisorDashboardController::class, 'getNumEvaluationsChartData']);
    Route::get('/dashboard/charts/performance', [SupervisorDashboardController::class, 'getPerformanceChartData']);
    Route::get('/dashboard/charts/education-stages', [SupervisorDashboardController::class, 'getEducationStagesChartData']);
    Route::get('/dashboard/recent-activities', [SupervisorDashboardController::class, 'getRecentActivities']);
    
    // Schools - المدارس
    Route::get('/schools', [SupervisorSchoolsController::class, 'getSupervisorSchools']);
    Route::post('/schools', [SupervisorSchoolsController::class, 'addSchoolToSupervision']);
    Route::delete('/schools/{schoolId}', [SupervisorSchoolsController::class, 'removeSchoolFromSupervision']);
    Route::get('/schools/available', [SupervisorSchoolsController::class, 'getAvailableSchools']);
    Route::get('/schools/{schoolId}/details', [SupervisorSchoolsController::class, 'getSchoolDetails']);
    
    // Profile - الملف الشخصي
    Route::get('/profile', [SupervisorProfileController::class, 'getSupervisorProfile']);
    Route::put('/profile', [SupervisorProfileController::class, 'updateSupervisorProfile']);
    Route::post('/profile/avatar', [SupervisorProfileController::class, 'updateSupervisorProfileImage']);
    Route::post('/profile/password', [SupervisorProfileController::class, 'changePassword']);
    
    // Reports - التقارير
    Route::get('/reports', [SupervisorReportsController::class, 'getSupervisorReports']);
    Route::post('/reports', [SupervisorReportsController::class, 'createReport']);
    Route::get('/reports/{reportId}', [SupervisorReportsController::class, 'getReportDetails']);
    Route::put('/reports/{reportId}', [SupervisorReportsController::class, 'updateReport']);
    Route::delete('/reports/{reportId}', [SupervisorReportsController::class, 'deleteReport']);
    Route::get('/reports/statistics', [SupervisorReportsController::class, 'getReportsStatistics']);
    
    // Invitations - الدعوات
    Route::get('/invitations', [SupervisorInvitationsController::class, 'getSupervisorInvitations']);
    Route::post('/invitations', [SupervisorInvitationsController::class, 'createSupervisorInvitation']);
    Route::put('/invitations/{invitationId}', [SupervisorInvitationsController::class, 'updateSupervisorInvitation']);
    Route::delete('/invitations/{invitationId}', [SupervisorInvitationsController::class, 'deleteSupervisorInvitation']);
    Route::get('/invitations/statistics', [SupervisorInvitationsController::class, 'getInvitationsStatistics']);
    
    // Principals - مدراء المدارس
    Route::get('/principals/pending', [SupervisorPrincipalsController::class, 'getPendingPrincipals']);
    Route::post('/principals/{userId}/approve', [SupervisorPrincipalsController::class, 'approvePendingPrincipal']);
    Route::post('/principals/{userId}/reject', [SupervisorPrincipalsController::class, 'rejectPendingPrincipal']);
    Route::get('/principals/active', [SupervisorPrincipalsController::class, 'getActivePrincipals']);
    Route::get('/principals/statistics', [SupervisorPrincipalsController::class, 'getPrincipalsStatistics']);
    
    // Notifications - الإشعارات (من الـ Controller القديم)
    Route::get('/notifications', [SupervisorDashboardController::class, 'getRealNotifications']);
    Route::put('/notifications/{id}/read', [SupervisorDashboardController::class, 'markRealNotificationAsRead']);
    
    // Support Tickets - تذاكر الدعم الفني (من الـ Controller القديم)
    Route::get('/support-tickets', [SupervisorDashboardController::class, 'getSupervisorSupportTickets']);
    Route::post('/support-tickets', [SupervisorDashboardController::class, 'createSupervisorSupportTicket']);
    
    // Messages/Chat - المحادثات (من الـ Controller القديم)
    Route::get('/conversations', [SupervisorDashboardController::class, 'getConversations']);
    Route::get('/conversations/{id}/messages', [SupervisorDashboardController::class, 'getMessages']);
    Route::post('/conversations/{id}/messages', [SupervisorDashboardController::class, 'sendMessage']);
    Route::get('/messages', [SupervisorDashboardController::class, 'getSupervisorMessages']);
    Route::post('/messages', [SupervisorDashboardController::class, 'sendSupervisorMessage']);
    
    // Principal Links Management - إدارة روابط المدراء
    Route::get('/principal-links', [SupervisorDashboardController::class, 'getPrincipalLinks']);
    Route::post('/principal-links', [SupervisorDashboardController::class, 'createPrincipalLink']);
    Route::put('/principal-links/{id}', [SupervisorDashboardController::class, 'updatePrincipalLink']);
    Route::delete('/principal-links/{id}', [SupervisorDashboardController::class, 'deletePrincipalLink']);
    Route::get('/principal-links/statistics', [SupervisorDashboardController::class, 'getPrincipalLinksStatistics']);
    
    // Chart Data - بيانات الرسوم البيانية (إضافية)
    Route::get('/charts/criteria', [SupervisorDashboardController::class, 'getEvaluationCriteriaChartData']);
});

// ============================================================================
// Admin Dashboard API Routes - Protected
// ============================================================================
Route::prefix('admin')->middleware(['auth:sanctum', 'role:0'])->group(function () {
    
    // Dashboard - لوحة التحكم
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'getDashboardStats']);
    
    // Profile - الملف الشخصي
    Route::get('/profile', [AdminProfileController::class, 'getAdminProfile']);
    Route::put('/profile', [AdminProfileController::class, 'updateAdminProfile']);
    Route::post('/profile/avatar', [AdminProfileController::class, 'updateAdminProfileImage']);
    Route::post('/profile/password', [AdminProfileController::class, 'changePassword']);
    
    // Users - المستخدمين
    Route::get('/users', [AdminDashboardController::class, 'getUsers']);
    Route::get('/users/{userId}', [AdminDashboardController::class, 'getUserDetails']);
    Route::put('/users/{userId}/status', [AdminDashboardController::class, 'updateUserStatus']);
    Route::delete('/users/{userId}', [AdminDashboardController::class, 'deleteUser']);
    
    // Schools - المدارس
    Route::get('/schools', [AdminSchoolsController::class, 'getSchools']);
    Route::get('/schools/{schoolId}', [AdminSchoolsController::class, 'getSchoolDetails']);
    Route::post('/schools', [AdminSchoolsController::class, 'createSchool']);
    Route::put('/schools/{schoolId}', [AdminSchoolsController::class, 'updateSchool']);
    Route::delete('/schools/{schoolId}', [AdminSchoolsController::class, 'deleteSchool']);
    
    // Reports - التقارير
    Route::get('/reports', [AdminReportsController::class, 'getReports']);
    Route::get('/reports/{reportId}', [AdminReportsController::class, 'getReportDetails']);
    Route::put('/reports/{reportId}/status', [AdminReportsController::class, 'updateReportStatus']);
    Route::delete('/reports/{reportId}', [AdminReportsController::class, 'deleteReport']);
    
    // Invitations - الدعوات
    Route::get('/invitations', [AdminInvitationsController::class, 'getInvitations']);
    Route::get('/invitations/{invitationId}', [AdminInvitationsController::class, 'getInvitationDetails']);
    Route::post('/invitations', [AdminInvitationsController::class, 'createInvitation']);
    Route::put('/invitations/{invitationId}', [AdminInvitationsController::class, 'updateInvitation']);
    Route::delete('/invitations/{invitationId}', [AdminInvitationsController::class, 'deleteInvitation']);
});

// ============================================================================
// School Manager API Routes - يمكن إضافتها لاحقاً
// ============================================================================
// Route::prefix('school-manager')->middleware(['auth:sanctum', 'role:2'])->group(function () {
//     // سيتم إضافة routes مدراء المدارس لاحقاً
// });

// ============================================================================
// Admin API Routes - يمكن إضافتها لاحقاً
// ============================================================================
// Route::prefix('admin')->middleware(['auth:sanctum', 'role:0'])->group(function () {
//     // سيتم إضافة routes المسؤولين لاحقاً
// });