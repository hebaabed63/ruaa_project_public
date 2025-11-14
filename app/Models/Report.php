<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'report_id';
    
    protected $fillable = [
        'supervisor_id',
        'school_id',
        'title',
        'description',
        'file_path',
        'status',
        'priority',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'review_comments'
    ];
    
    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime'
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
    
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by', 'user_id');
    }
}
