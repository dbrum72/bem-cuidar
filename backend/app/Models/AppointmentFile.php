<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentFile extends Model {

    protected $table = 'appointment_files';
    
    protected $fillable = [
        'appointment_id',
        'filename',
        'storaged'
    ];
}
