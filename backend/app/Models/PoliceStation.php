<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PoliceStation extends Model
{
    protected $fillable = [
        'zone_id', 'name', 'code', 'address', 'phone', 'email',
        'latitude', 'longitude', 'station_type', 'is_active',
    ];

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function officers(): HasMany
    {
        return $this->hasMany(User::class, 'station_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'station_id');
    }
}
