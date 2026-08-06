<?php

namespace App\Services;

use App\Models\CaseTimeline;
use App\Models\Report;
use App\Models\User;

class CaseTimelineService
{
    public static function log(
        Report $report,
        string $eventType,
        ?User $actor = null,
        ?string $note = null,
        ?string $oldValue = null,
        ?string $newValue = null,
        ?array $metadata = null,
    ): CaseTimeline {
        return CaseTimeline::create([
            'report_id' => $report->id,
            'actor_id' => $actor?->id,
            'event_type' => $eventType,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'note' => $note,
            'metadata' => $metadata,
            'created_at' => now(),
        ]);
    }
}
