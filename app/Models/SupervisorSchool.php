<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisorSchool extends Model
{
    use HasFactory;
 protected $table = 'school_supervisors';
    protected $fillable = ['school_id','supervisor_id','assigned_at'];

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }}
