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
}
