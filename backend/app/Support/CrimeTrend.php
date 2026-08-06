<?php

namespace App\Support;

use App\Models\Report;

class CrimeTrend
{
    public static function monthlyForYear(?int $year = null): array
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $year ??= now()->year;

        $reports = Report::whereYear('submitted_at', $year)
            ->get()
            ->groupBy(fn ($report) => (int) $report->submitted_at->format('n'))
            ->map->count();

        $resolved = Report::whereYear('resolved_at', $year)
            ->whereNotNull('resolved_at')
            ->get()
            ->groupBy(fn ($report) => (int) $report->resolved_at->format('n'))
            ->map->count();

        return collect(range(1, 12))->map(fn ($month) => [
            'month' => $months[$month - 1],
            'reports' => (int) ($reports[$month] ?? 0),
            'resolved' => (int) ($resolved[$month] ?? 0),
        ])->all();
    }
}
