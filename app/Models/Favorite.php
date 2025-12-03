<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Favorite extends Pivot
{
    protected $table = 'favorites';
    public $incrementing = true;
}