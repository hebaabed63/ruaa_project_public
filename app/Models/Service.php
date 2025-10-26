<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'icon',
        'features',
        'order',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Scope for active services
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }
}
