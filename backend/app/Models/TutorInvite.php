<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TutorInvite extends Model {

    protected $table = 'tutor_invites';

    protected $fillable = [
        'inviter_id',
        'tutor_id',
        'tutor_email',
        'token',
        'status' // pending, accepted, refused, cancelled
    ];

    protected $casts = [
        'inviter_id' => 'integer',
        'tutor_id' => 'integer',
    ];

    public static function boot() {

        parent::boot();

        static::creating(function ($model) {
            if (empty($model->token)) {
                $model->token = Str::random(48);
            }
            if (empty($model->status)) {
                $model->status = 'pending';
            }
        });
    }

    public function inviter() {

        return $this->belongsTo('App/Models/User', 'inviter_id');
    }

    public function tutor() {

        return $this->belongsTo('App/Models/User', 'tutor_id');
    }
}
