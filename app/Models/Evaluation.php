    
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $primaryKey = 'evaluation_id';
    protected $table = 'evaluations';

    protected $fillable = [
        'school_id',
        'parent_id',
        'supervisor_id',
        'comment',
        'anonymous',
        'would_recommend',
        'status',
        'evaluation_date',
    ];

    protected $casts = [
        'anonymous' => 'boolean',
        'would_recommend' => 'boolean',
        'evaluation_date' => 'datetime',
    ];

    // Relationships
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }

    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id', 'user_id');
    }

    public function criteria()
    {
        return $this->hasMany(EvaluationCriterion::class, 'evaluation_id', 'evaluation_id');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id', 'user_id');
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}