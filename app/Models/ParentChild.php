<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentChild extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    protected $table = 'parent_children';

    protected $fillable = [
        'parent_id',
        'child_id',
        'child_name',
        'child_grade',
        'child_section',
        'school_id',
        'status'
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Relationships
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }

    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id', 'user_id');
    }
}