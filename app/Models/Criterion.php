<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Criterion extends Model
{
    use HasFactory;

    protected $primaryKey = 'criterion_id';
    protected $table = 'criteria';

    protected $fillable = [
        'name',
        'description',
        'weight',
        'is_active',
        'is_required',
        'sort_order',
        'max_score',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_required' => 'boolean',
        'weight' => 'decimal:2',
        'max_score' => 'integer',
    ];

    // Relationships
    public function evaluationCriteria()
    {
        return $this->hasMany(EvaluationCriterion::class, 'criterion_id', 'criterion_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('criterion_id');
    }
}