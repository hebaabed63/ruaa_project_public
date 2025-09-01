<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    public $timestamps = false;
    
    protected $primaryKey = 'message_id';
    protected $fillable = [
        'conversation_id', 
        'sender_type', 
        'sender_id', 
        'content', 
        'attachment_url', 
        'attachment_type',
        'timestamp'
    ];
    
    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id', 'conversation_id');
    }
    
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'user_id');
    }
}
