<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dependent extends Model {

    protected $table = 'dependents';

    protected $fillable = [
        'name',
        'birth_date',
        'notes',
        'created_by'
    ];

    public function tutors()
    {
        return $this->belongsToMany('App/Models/User', 'dependent_tutor', 'dependent_id', 'tutor_id')
                    ->withPivot('relationship_type', 'status', 'invite_token')
                    ->withTimestamps();
    }
}
