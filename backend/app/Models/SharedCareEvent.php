<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SharedCareEvent extends Model {

    protected $table = 'shared_care_events';

    protected $fillable = [
        'child_id',
        'title',
        'description',
        'start_datetime',
        'end_datetime',
        'location',
        'total_expense',
        'created_by'
    ];
}
