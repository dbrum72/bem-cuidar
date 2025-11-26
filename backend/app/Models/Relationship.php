<?php

namespace App\Models;
use App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Relationship extends Model {

    protected $table = 'dependent_tutor';

    protected $fillable = [
        'dependent_id',
        'tutor_id',
        'relationship_type',
        'photo',
        'status',
        'invite_token',
        'expires_at'
    ];
}
