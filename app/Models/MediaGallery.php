<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaGallery extends Model
{
    public $timestamps = false;
    protected $table = 'media_gallery';
    protected $primaryKey = 'media_id';
    protected $fillable = [
        'school_id',
        'type',
        'url',
        'description',
        'uploaded_at'
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }
}
