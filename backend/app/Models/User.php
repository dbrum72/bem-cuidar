<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements JWTSubject {

    use Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getJWTIdentifier() {

        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        
        return [];
    }

    public function dependents() {
        
        return $this->belongsToMany('App/Models/Dependent', 'dependent_tutor', 'tutor_id', 'dependent_id')
                    ->withPivot('relationship_type', 'status', 'invite_token')
                    ->withTimestamps();
    }
}
