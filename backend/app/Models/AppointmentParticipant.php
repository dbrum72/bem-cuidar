<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentParticipant extends Model {

    protected $table = 'appointment_participants';
    
    protected $fillable = [
        'appointment_id',
        'participant_id',
        'share_percentage',
        'payment_status',
        'accepted_status'
    ];
}
