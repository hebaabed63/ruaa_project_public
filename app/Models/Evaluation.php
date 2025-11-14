<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $primaryKey = 'evaluation_id';
    protected $fillable = ['school_id', 'supervisor_id', 'parent_id', 'date' ,'comment'];
    
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }
    
    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id', 'user_id');
    }
    
    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id', 'user_id');
    }
    
    public function criteria()
    {
        return $this->belongsToMany(Criterion::class, 'evaluation_criteria', 'evaluation_id', 'criterion_id')
            ->withPivot('score');
    }
    
      public function items()
    {
        return $this->hasMany(EvaluationCriterion::class, 'evaluation_id', 'evaluation_id');
    }
}
