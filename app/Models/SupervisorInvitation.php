<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisorInvitation extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'invitation_id';
    
    protected $fillable = [
        'supervisor_id',
        'school_id',
        'invitee_name',
        'invitee_email',
        'token',
        'status',
        'expires_at',
        'accepted_at',
        'message'
    ];
    
    protected $casts = [
        'expires_at' => 'datetime',
        'accepted_at' => 'datetime'
    ];
    
    // Relationships
    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id', 'user_id');
    }
    
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }
}
