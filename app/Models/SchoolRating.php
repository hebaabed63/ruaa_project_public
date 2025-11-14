<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolRating extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'user_id',
        'parent_name',
        'rating',
        'comment',
        'criteria',
        'is_approved',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
        'criteria' => 'array',
        'is_approved' => 'boolean',
    ];

    /**
     * Get the school
     */
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Get the user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for approved ratings
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }
}
