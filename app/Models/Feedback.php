<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;
    protected $table = 'feedback';

    protected $fillable = [
        'rating',
        'mood',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];
}
