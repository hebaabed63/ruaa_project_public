<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationCriterion extends Model
{
    protected $primaryKey = 'evaluation_criteria_id';
    protected $fillable = ['evaluation_id', 'criterion_id', 'score'];
    public $timestamps = false;
    
    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class, 'evaluation_id', 'evaluation_id');
    }
    
    public function criterion()
    {
        return $this->belongsTo(Criterion::class, 'criterion_id', 'criterion_id');
    }
}
