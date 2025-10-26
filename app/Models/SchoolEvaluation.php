<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolEvaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'evaluator_id',
        'evaluation_date',
        'criteria',
        'scores',
        'total_score',
        'notes',
        'is_published',
    ];

    protected $casts = [
        'evaluation_date' => 'date',
        'criteria' => 'array',
        'scores' => 'array',
        'total_score' => 'decimal:2',
        'is_published' => 'boolean',
    ];

    /**
     * Get the school
     */
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Get the evaluator
     */
    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }
}
