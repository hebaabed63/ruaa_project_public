<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criterion extends Model
{
    protected $primaryKey = 'criterion_id';
    protected $fillable = ['name', 'description'];
    public $timestamps = false;
    
    public function evaluations()
    {
        return $this->belongsToMany(Evaluation::class, 'evaluation_criteria', 'criterion_id', 'evaluation_id')
                    ->withPivot('score');
    }
      public function evaluationItems()
    {
        return $this->hasMany(EvaluationCriterion::class, 'criterion_id', 'criterion_id');
    }
}
