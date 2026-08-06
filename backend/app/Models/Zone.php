<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Zone extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_active', 'sort_order'];

    public function policeStations(): HasMany
    {
        return $this->hasMany(PoliceStation::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
