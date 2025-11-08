<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model {

    protected $table = 'appointments';

    protected $fillable = [
        'dependent_id',
        'title',
        'description',
        'start_datetime',
        'end_datetime',
        'location',
        'total_expense',
        'created_by'
    ];
}
