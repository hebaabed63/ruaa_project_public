<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationCriterion extends Model
{
    use HasFactory;

    protected $table = 'evaluation_criteria';
    protected $primaryKey = 'id';

    protected $fillable = [
        'evaluation_id',
        'criterion_id',
        'score',
    ];

    protected $casts = [
        'score' => 'decimal:1',
    ];

    // Relationships
    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class, 'evaluation_id', 'evaluation_id');
    }

    public function criterion()
    {
        return $this->belongsTo(Criterion::class, 'criterion_id', 'criterion_id');
    }
}