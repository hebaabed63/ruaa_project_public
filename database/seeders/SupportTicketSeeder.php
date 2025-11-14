<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SupportTicket;
use App\Models\User;

class SupportTicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users to associate with tickets
        $users = User::take(5)->get();
        
        if ($users->count() > 0) {
            $tickets = [
                [
                    'title' => 'مشكلة في تسجيل الدخول',
                    'description' => 'لا أستطيع تسجيل الدخول إلى النظام، أظهر رسالة خطأ تقول "بيانات الاعتماد غير صحيحة"',
                    'user_id' => $users->random()->user_id,
                    'priority' => 'high',
                    'status' => 'open',
                ],
                [
                    'title' => 'بطء في تحميل البيانات',
                    'description' => 'يستغرق تحميل صفحة الطلاب وقتاً طويلاً جداً، خاصة في أوقات الذروة',
                    'user_id' => $users->random()->user_id,
                    'priority' => 'medium',
                    'status' => 'in_progress',
                ],
                [
                    'title' => 'طلب ميزة جديدة',
                    'description' => 'أود اقتراح إضافة ميزة لإرسال إشعارات للطلاب عند تحديث جدول الامتحانات',
                    'user_id' => $users->random()->user_id,
                    'priority' => 'low',
                    'status' => 'resolved',
                ],
                [
                    'title' => 'مشكلة في الطباعة',
                    'description' => 'لا يمكنني طباعة التقارير من النظام، يظهر خطأ في المتصفح',
                    'user_id' => $users->random()->user_id,
                    'priority' => 'medium',
                    'status' => 'open',
                ],
                [
                    'title' => 'تحديث معلومات الحساب',
                    'description' => 'يرجى تحديث بريدي الإلكتروني من example@old.com إلى example@new.com',
                    'user_id' => $users->random()->user_id,
                    'priority' => 'low',
                    'status' => 'closed',
                ],
            ];
            
            foreach ($tickets as $ticketData) {
                SupportTicket::create($ticketData);
            }
        }
    }
}