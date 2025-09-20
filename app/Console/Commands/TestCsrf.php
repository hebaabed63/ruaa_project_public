<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Session;

class TestCsrf extends Command
{
    protected $signature = 'test:csrf';
    protected $description = 'Test CSRF token generation';

    public function handle()
    {
        $token = csrf_token();
        $sessionToken = Session::token();
        
        $this->info('CSRF Token: ' . $token);
        $this->info('Session Token: ' . $sessionToken);
        
        if ($token === $sessionToken) {
            $this->info('✅ CSRF token matches session token');
        } else {
            $this->error('❌ CSRF token does not match session token');
        }
        
        return 0;
    }
}
