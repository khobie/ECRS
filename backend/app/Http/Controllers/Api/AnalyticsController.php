<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrimeCategory;
use App\Models\PoliceStation;
use App\Models\Report;
use App\Models\Zone;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    private const ZONE_POSITIONS = [
        'central-koforidua' => ['x' => 52, 'y' => 48],
        'oyoko' => ['x' => 68, 'y' => 35],
        'jumapo' => ['x' => 38, 'y' => 58],
        'betom' => ['x' => 45, 'y' => 72],
        'srodae' => ['x' => 62, 'y' => 65],
        'adweso' => ['x' => 28, 'y' => 42],
        'effiduase' => ['x' => 30, 'y' => 55],
        'old-estates' => ['x' => 55, 'y' => 38],
        'pentecost-junction' => ['x' => 48, 'y' => 62],
        'koforidua-technical-area' => ['x' => 42, 'y' => 35],
    ];

    public function index(): JsonResponse
    {
        return response()->json([
            'crime_trend' => $this->crimeTrend(),
            'reports_by_zone' => $this->reportsByZone(),
            'category_distribution' => $this->categoryDistribution(),
            'resolution_rates' => $this->resolutionRates(),
            'hotspots' => $this->hotspots(),
            'stations' => $this->stations(),
        ]);
    }

    private function crimeTrend(): array
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $year = now()->year;

        $reports = Report::selectRaw('MONTH(submitted_at) as m, COUNT(*) as c')
            ->whereYear('submitted_at', $year)
            ->groupBy('m')
            ->pluck('c', 'm');

        $resolved = Report::selectRaw('MONTH(resolved_at) as m, COUNT(*) as c')
            ->whereYear('resolved_at', $year)
            ->whereNotNull('resolved_at')
            ->groupBy('m')
            ->pluck('c', 'm');

        return collect(range(1, 12))->map(fn ($m) => [
            'month' => $months[$m - 1],
            'reports' => (int) ($reports[$m] ?? 0),
            'resolved' => (int) ($resolved[$m] ?? 0),
        ])->all();
    }

    private function reportsByZone(): array
    {
        return Zone::withCount('reports')
            ->orderByDesc('reports_count')
            ->get()
            ->map(fn ($z) => [
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

    private function resolutionRates(): array
    {
        return Zone::withCount([
            'reports',
            'reports as resolved_count' => fn ($q) => $q->whereIn('status', ['resolved', 'closed']),
        ])
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($z) => [
                'zone' => strtok($z->name, ' '),
                'rate' => $z->reports_count > 0
                    ? (int) round(($z->resolved_count / $z->reports_count) * 100)
                    : 0,
            ])
            ->all();
    }

    private function hotspots(): array
    {
        $max = max(1, (int) Zone::withCount('reports')->get()->max('reports_count'));

        return Zone::withCount('reports')
            ->get()
            ->filter(fn ($z) => $z->reports_count > 0)
            ->sortByDesc('reports_count')
            ->values()
            ->map(function ($z) use ($max) {
                $pos = self::ZONE_POSITIONS[$z->slug] ?? ['x' => 50, 'y' => 50];
                $ratio = $z->reports_count / $max;

                return [
                    'name' => $z->name,
                    'x' => $pos['x'],
                    'y' => $pos['y'],
                    'count' => $z->reports_count,
                    'level' => $ratio >= 0.7 ? 'high' : ($ratio >= 0.35 ? 'medium' : 'low'),
                ];
            })
            ->all();
    }

    private function stations(): array
    {
        return PoliceStation::where('is_active', true)
            ->get()
            ->map(function ($s) {
                $lat = $s->latitude ?? 6.094;
                $lng = $s->longitude ?? 0.257;
                $x = (($lng + 0.26) / 0.04) * 100;
                $y = ((6.10 - $lat) / 0.06) * 100;

                return [
                    'name' => $s->name,
                    'x' => max(10, min(90, round($x))),
                    'y' => max(10, min(90, round($y))),
                ];
            })
            ->all();
    }
}
