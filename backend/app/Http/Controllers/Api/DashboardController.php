<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrimeCategory;
use App\Models\PoliceStation;
use App\Models\Report;
use App\Models\Zone;
use App\Support\CrimeTrend;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $total = Report::count();
        $newToday = Report::whereDate('submitted_at', today())->count();
        $open = Report::whereNotIn('status', ['resolved', 'closed'])->count();
        $resolved = Report::whereIn('status', ['resolved', 'closed'])->count();
        $highPriority = Report::whereIn('priority', ['high', 'critical'])
            ->whereNotIn('status', ['resolved', 'closed'])
            ->count();

        return response()->json([
            'stats' => [
                ['label' => 'Total Reports', 'value' => (string) $total, 'icon' => 'FileText', 'trend' => '', 'tone' => 'police'],
                ['label' => 'New Reports Today', 'value' => (string) $newToday, 'icon' => 'FilePlus', 'trend' => '', 'tone' => 'gold'],
                ['label' => 'Open Cases', 'value' => (string) $open, 'icon' => 'FolderOpen', 'trend' => '', 'tone' => 'blue'],
                ['label' => 'Resolved Cases', 'value' => (string) $resolved, 'icon' => 'CheckCircle2', 'trend' => '', 'tone' => 'emerald'],
                ['label' => 'High Priority', 'value' => (string) $highPriority, 'icon' => 'AlertTriangle', 'trend' => '', 'tone' => 'red'],
            ],
            'crime_trend' => CrimeTrend::monthlyForYear(),
            'reports_by_zone' => $this->reportsByZone(),
            'category_distribution' => $this->categoryDistribution(),
            'recent_reports' => $this->recentReports(),
        ]);
    }

    public function landingStats(): JsonResponse
    {
        $total = Report::count();
        $investigating = Report::where('status', 'under_investigation')->count();
        $resolved = Report::whereIn('status', ['resolved', 'closed'])->count();
        $stations = PoliceStation::count();

        return response()->json([
            'data' => [
                ['label' => 'Total Reports Received', 'value' => (string) $total, 'icon' => 'FileText', 'trend' => ''],
                ['label' => 'Cases Under Investigation', 'value' => (string) $investigating, 'icon' => 'Search', 'trend' => ''],
                ['label' => 'Cases Resolved', 'value' => (string) $resolved, 'icon' => 'ShieldCheck', 'trend' => ''],
                ['label' => 'Police Stations in Koforidua', 'value' => (string) $stations, 'icon' => 'Building2', 'trend' => ''],
            ],
        ]);
    }

    private function reportsByZone(): array
    {
        $colors = ['#003366', '#1f5d99', '#F4B400', '#4a7cb0', '#d99e00', '#7099c2', '#9db7d4', '#2d6a9f'];

        return Zone::withCount('reports')
            ->orderByDesc('reports_count')
            ->get()
            ->map(fn ($z, $i) => [
                'region' => strtok($z->name, ' '),
                'zone' => $z->name,
                'reports' => $z->reports_count,
            ])
            ->values()
            ->all();
    }

    private function categoryDistribution(): array
    {
        $colors = ['#003366', '#F4B400', '#1f5d99', '#7099c2', '#d99e00', '#9db7d4'];
        $total = Report::count();

        if ($total === 0) {
            return CrimeCategory::orderBy('sort_order')->get()->map(fn ($c, $i) => [
                'name' => $c->name,
                'value' => 0,
                'color' => $colors[$i % count($colors)],
            ])->all();
        }

        return CrimeCategory::withCount('reports')
            ->orderByDesc('reports_count')
            ->get()
            ->map(fn ($c, $i) => [
                'name' => $c->name,
                'value' => round(($c->reports_count / $total) * 100),
                'color' => $colors[$i % count($colors)],
            ])
            ->all();
    }

    private function recentReports(): array
    {
        return Report::with(['crimeType', 'zone', 'assignedOfficer'])
            ->orderByDesc('submitted_at')
            ->limit(6)
            ->get()
            ->map(fn ($r) => $this->formatReport($r))
            ->all();
    }

    public static function formatReport(Report $r): array
    {
        return [
            'id' => $r->case_id,
            'crimeType' => $r->crimeType->name,
            'dateReported' => $r->submitted_at,
            'location' => $r->location,
            'zone' => $r->zone->name,
            'priority' => ucfirst($r->priority),
            'status' => match ($r->status) {
                'submitted' => 'Submitted',
                'assigned' => 'Assigned',
                'under_investigation' => 'Under Investigation',
                'pending_review' => 'Pending Review',
                'resolved' => 'Resolved',
                'closed' => 'Closed',
                default => $r->status,
            },
            'officer' => $r->assignedOfficer?->name ?? 'Unassigned',
            'anonymous' => $r->is_anonymous,
            'reporter' => $r->is_anonymous ? 'Anonymous' : ($r->reporter_name ?? '—'),
            'phone' => $r->is_anonymous ? '—' : ($r->reporter_phone ?? '—'),
            'description' => $r->description,
        ];
    }
}
