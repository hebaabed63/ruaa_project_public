<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisorLink extends Model
{
    use HasFactory;
      protected $table = 'supervisor_links';
    protected $primaryKey = 'link_id';
    protected $fillable = [
        'token','link_type','organization_id','is_active',
        'expires_at','max_uses','used_count'
    ];

    public function organization()
    {
        return $this->belongsTo(User::class, 'organization_id')->where('role', 1);
    }
}
