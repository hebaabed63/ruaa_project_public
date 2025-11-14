<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'parent_id',
        'school_id',
        'type',
        'description',
        'attachment_path',
        'status'
    ];

    /**
     * Get the parent that owns the complaint.
     */
    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id', 'user_id');
    }

    /**
     * Get the school that the complaint is about.
     */
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }
}
