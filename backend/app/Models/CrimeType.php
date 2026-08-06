<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CrimeType extends Model
{
    protected $fillable = ['category_id', 'name', 'slug', 'is_active', 'sort_order'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(CrimeCategory::class, 'category_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'crime_type_id');
    }
}
