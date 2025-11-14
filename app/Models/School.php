<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $primaryKey = 'school_id';
    
    protected $fillable = [
        'name',
        'english_name',
        'description',
        'logo',
        'cover_image',
        'address',
        'region',
        'city',
        'directorate',
        'latitude',
        'longitude',
        'type',
        'school_type',
        'level',
        'principal_name',
        'students_count',
        'teachers_count',
        'established',
        'rating',
        'reviews_count',
        'phone',
        'email',
        'website',
        'certifications',
        'achievements',
        'features',
        'is_active',
        'is_featured',
    ];
    
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'rating' => 'decimal:2',
        'students_count' => 'integer',
        'teachers_count' => 'integer',
        'reviews_count' => 'integer',
        'established' => 'integer',
        'certifications' => 'array',
        'achievements' => 'array',
        'features' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    /**
     * Get the school's full address.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->city,
            $this->region,
        ]);
        
        return implode(', ', $parts);
    }

    /**
     * Get the school's coordinates as array.
     */
    public function getCoordinatesAttribute(): ?array
    {
        if ($this->latitude && $this->longitude) {
            return [
                'lat' => (float) $this->latitude,
                'lng' => (float) $this->longitude,
            ];
        }
        
        return null;
    }

    /**
     * Scope: Active schools only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Featured schools
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope: Filter by region
     */
    public function scopeByRegion($query, $region)
    {
        return $query->where('region', $region);
    }

    /**
     * Scope: Filter by city
     */
    public function scopeByCity($query, $city)
    {
        return $query->where('city', $city);
    }

    /**
     * Scope: Filter by directorate
     */
    public function scopeByDirectorate($query, $directorate)
    {
        return $query->where('directorate', $directorate);
    }

    /**
     * Scope: Filter by school type
     */
    public function scopeBySchoolType($query, $type)
    {
        return $query->where('school_type', $type);
    }

    /**
     * Scope: Filter by level
     */
    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    /**
     * Scope: Minimum rating filter
     */
    public function scopeMinRating($query, $rating)
    {
        return $query->where('rating', '>=', $rating);
    }

    /**
     * Scope: Search schools
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('english_name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('city', 'like', "%{$search}%")
              ->orWhere('address', 'like', "%{$search}%");
        });
    }

    /**
     * Scope: Best schools (highest rating)
     */
    public function scopeBest($query, $limit = 10)
    {
        return $query->active()
                     ->orderBy('rating', 'desc')
                     ->orderBy('reviews_count', 'desc')
                     ->limit($limit);
    }

    /**
     * Scope: Recently added schools
     */
    public function scopeRecent($query, $limit = 10)
    {
        return $query->active()
                     ->orderBy('created_at', 'desc')
                     ->limit($limit);
    }
     public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id')->where('role', 2);
    }

    // 🧑‍🏫 المشرفون المرتبطون
    public function supervisors()
    {
        return $this->belongsToMany(User::class, 'school_supervisors', 'school_id', 'supervisor_id')
                    ->withPivot('assigned_at');
    }

    // 🧾 التقييمات الخاصة بالمدرسة
    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'school_id');
    }

    // 🖼️ معرض الوسائط
    public function mediaGallery()
    {
        return $this->hasMany(MediaGallery::class, 'school_id');
    }

    // 💬 المحادثات المرتبطة
    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'school_id');
    }
}
