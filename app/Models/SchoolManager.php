<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolManager extends Model
{
    protected $primaryKey = 'manager_id';
    public $incrementing = false;
    protected $fillable = ['manager_id', 'school_id'];
    
    public function user()
    {
        return $this->belongsTo(User::class, 'manager_id', 'user_id');
    }
    
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }
}
