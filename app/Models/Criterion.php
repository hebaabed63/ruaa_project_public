<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criterion extends Model
{
    protected $primaryKey = 'criterion_id';
    protected $fillable = ['name', 'description'];
    public $timestamps = false;
}
