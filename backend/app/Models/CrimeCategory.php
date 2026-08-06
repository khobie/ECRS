<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CrimeCategory extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_active', 'sort_order'];

    public function crimeTypes(): HasMany
    {
        return $this->hasMany(CrimeType::class, 'category_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'category_id');
    }
}
