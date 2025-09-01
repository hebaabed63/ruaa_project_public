<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $primaryKey = 'conversation_id';
    protected $fillable = ['school_id', 'conversation_type', 'status'];
    
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }
    
    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id', 'conversation_id');
    }
}
