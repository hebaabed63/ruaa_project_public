<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'user_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'profile_image',
        'password',
        'role',
        'phone',
        'address',
        'google_id',
        'avatar',
        'email_verified_at',
        'verification_token',
        'verification_token_expires_at',
        'supervisor_verification_token',
        'supervisor_verification_token_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => 'integer',
    ];

    /**
     * Get the children for the parent user.
     */
    public function children()
    {
        return $this->hasMany(ParentChild::class, 'parent_id', 'user_id');
    }

    /**
     * Get the notifications for the user.
     */
    public function notifications()
    {
        return $this->hasMany(ParentNotification::class, 'user_id', 'user_id');
    }

    /**
     * Get schools through children relationship.
     */
    public function schools()
    {
        return $this->hasManyThrough(
            School::class,
            ParentChild::class,
            'parent_id', // Foreign key on parent_children table
            'school_id', // Foreign key on schools table
            'user_id', // Local key on users table
            'school_id' // Local key on parent_children table
        );
    }

    // 🏫 مدير مدرسة
    public function managedSchool()
    {
        return $this->hasOne(School::class, 'manager_id');
    }

    // 🧑‍🏫 مدارس يشرف عليها
    public function supervisedSchools()
    {
        return $this->belongsToMany(School::class, 'school_supervisors', 'supervisor_id', 'school_id')
                    ->withPivot('assigned_at');
    }

    // 🧾 تقييمات أعدها كمشرف
    public function evaluationsAsSupervisor()
    {
        return $this->hasMany(Evaluation::class, 'supervisor_id');
    }

    // 🧾 تقييمات أعدها كولي أمر
    public function evaluationsAsParent()
    {
        return $this->hasMany(Evaluation::class, 'parent_id');
    }

    // 💬 رسائل أرسلها
    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    // 🔗 روابط المشرفين والمدراء
    public function supervisorLinks()
    {
        return $this->hasMany(SupervisorLink::class, 'organization_id');
    }
}
