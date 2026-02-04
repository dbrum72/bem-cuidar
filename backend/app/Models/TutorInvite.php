<?php

namespace App\Models;

use App\Models\User;
use App\Models\Dependent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TutorInvite extends Model {

    protected $table = 'tutor_invites';

    protected $fillable = [
        'inviter_id',
        'dependent_id',
        'tutor_id',
        'tutor_email',
        'message',
        'token',
        'status' // pendente, aceito, refused, cancelled
    ];

    protected $casts = [
        'inviter_id' => 'integer',
        'dependent_id' => 'integer',
        'tutor_id' => 'integer',
    ];

    public static function boot() {

        parent::boot();

        static::creating(function ($model) {
            if (empty($model->token)) {
                $model->token = Str::random(48);
            }
            if (empty($model->status)) {
                $model->status = 'pendente';
            }
        });
    }

    public function dependent() {

        return $this->belongsTo(Dependent::class, 'dependent_id');
    }

    public function inviter() {

        return $this->belongsTo(User::class, 'inviter_id');
    }

    public function tutor() {

        return $this->belongsTo(User::class, 'tutor_id');
    }
}
