<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentChild extends Model
{
    use HasFactory;

    protected $table = 'parent_children';
    protected $primaryKey = 'child_id';

    protected $fillable = [
        'parent_id',
        'school_id',
        'child_name',
        'child_grade',
        'child_section',
        'status',
        'enrollment_date',
    ];

    protected $casts = [
        'enrollment_date' => 'date',
    ];

    /**
     * Get the parent (user) that owns the child.
     */
    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id', 'user_id');
    }

    /**
     * Get the school that the child attends.
     */
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }

    /**
     * Scope: Active children only
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
