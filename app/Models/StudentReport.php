<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentReport extends Model
{
    use HasFactory;

    protected $table = 'student_reports';

    protected $fillable = [
        'student_id',
        'term',
        'summary',
        'attendance',
        'activity',
        'grades',
        'homeworks',
    ];

    /**
     * Cast JSON fields to arrays
     */
    protected $casts = [
        'summary' => 'array',
        'attendance' => 'array',
        'activity' => 'array',
        'grades' => 'array',
        'homeworks' => 'array',
    ];
}
