<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    use HasFactory;

    protected $table = 'about';

    protected $fillable = [
        'goal_title',
        'goal_content',
        'vision_title',
        'vision_content',
        'story_title',
        'story_paragraphs',
        'values',
        'statistics',
        'partners',
        'development_plan',
        'is_active',
    ];

    protected $casts = [
        'story_paragraphs' => 'array',
        'values' => 'array',
        'statistics' => 'array',
        'partners' => 'array',
        'development_plan' => 'array',
        'is_active' => 'boolean',
    ];
}
