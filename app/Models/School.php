<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $primaryKey = 'school_id';
    protected $fillable = ['name', 'logo', 'cover_image', 'address', 'type', 'certifications', 'achievements'];
    
    protected $casts = [
        'certifications' => 'array',
        'achievements' => 'array',
    ];
}
