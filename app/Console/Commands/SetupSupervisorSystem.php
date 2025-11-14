<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SetupSupervisorSystem extends Command
{
    protected $signature = 'setup:supervisor-system';
    protected $description = 'Setup initial data for supervisor registration system';

    public function handle()
    {
        $this->info('🚀 Setting up supervisor registration system...');
        
        // Create test admin user if not exists
        $admin = DB::table('users')->where('email', 'admin@ruaa.com')->first();

        if (!$admin) {
            $adminId = DB::table('users')->insertGetId([
                'name' => 'مدير النظام',
                'email' => 'admin@ruaa.com',
                'password' => Hash::make('admin123'),
                'role' => 0, // admin
                'status' => 'active',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            $this->info('✅ تم إنشاء حساب المدير: admin@ruaa.com (كلمة المرور: admin123)');
        } else {
            $this->info('ℹ️  حساب المدير موجود بالفعل: admin@ruaa.com');
        }

        // Create supervisor invitation link
        $supervisorToken = Str::random(32);
        $supervisorLinkId = DB::table('supervisor_links')->insertGetId([
            'token' => $supervisorToken,
            'link_type' => 'supervisor',
            'organization_id' => null,
            'is_active' => true,
            'expires_at' => now()->addWeeks(2),
            'max_uses' => 10,
            'used_count' => 0,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $this->info('✅ تم إنشاء رابط دعوة المشرف:');
        $this->line('🔗 http://localhost:3000/register/supervisor/' . $supervisorToken);

        // Create principal invitation link
        $principalToken = Str::random(32);
        $principalLinkId = DB::table('supervisor_links')->insertGetId([
            'token' => $principalToken,
            'link_type' => 'principal',
            'organization_id' => null,
            'is_active' => true,
            'expires_at' => now()->addWeeks(2),
            'max_uses' => 5,
            'used_count' => 0,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $this->info('✅ تم إنشاء رابط دعوة مدير المدرسة:');
        $this->line('🔗 http://localhost:3000/register/principal?supervisor_token=' . $principalToken);

        $this->newLine();
        $this->info('📋 ملخص النظام:');
        $this->line('1. صفحة تسجيل المشرفين: /register/supervisor/{token}');
        $this->line('2. صفحة تسجيل مدراء المدارس: /register/principal?supervisor_token={token}');
        $this->line('3. إدارة الدعوات في لوحة الأدمن: /admin/supervisor-links');
        $this->line('4. تسجيل الدخول للأدمن: /login (admin@ruaa.com / admin123)');

        $this->newLine();
        $this->info('🎯 الآن يمكنك:');
        $this->line('- تسجيل الدخول كأدمن');
        $this->line('- إنشاء روابط دعوة جديدة');
        $this->line('- تتبع استخدام الروابط');
        $this->line('- إدارة حالة الروابط (تفعيل/تعطيل)');
        
        return 0;
    }
}
