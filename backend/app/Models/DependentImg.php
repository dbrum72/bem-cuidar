<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class DependentImg extends Model {

    protected $table = 'dependent_image';

    protected $fillable = [
        'name',
        'storaged',
        'dependent_id' 
    ];

    function child(): HasOne {

        return $this->hasOne(Child::class);
    }
}