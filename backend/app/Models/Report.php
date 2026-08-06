<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Report extends Model
{
    protected $fillable = [
        'case_id', 'tracking_pin', 'category_id', 'crime_type_id',
        'incident_date', 'incident_time', 'location', 'zone_id',
        'latitude', 'longitude', 'description', 'suspect_info', 'witness_info',
        'is_anonymous', 'reporter_name', 'reporter_phone', 'reporter_email',
        'status', 'priority', 'assigned_officer_id', 'station_id',
        'resolution_summary', 'resolved_at', 'closed_at', 'submitted_at',
        'ip_address', 'user_agent',
    ];

    protected $casts = [
        'incident_date' => 'date',
        'is_anonymous' => 'boolean',
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(CrimeCategory::class, 'category_id');
    }

    public function crimeType(): BelongsTo
    {
        return $this->belongsTo(CrimeType::class, 'crime_type_id');
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function assignedOfficer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_officer_id');
    }

    public function station(): BelongsTo
    {
        return $this->belongsTo(PoliceStation::class, 'station_id');
    }

    public function evidenceFiles(): HasMany
    {
        return $this->hasMany(EvidenceFile::class);
    }

    public function investigationNotes(): HasMany
    {
        return $this->hasMany(InvestigationNote::class);
    }

    public function timeline(): HasMany
    {
        return $this->hasMany(CaseTimeline::class);
    }
}
