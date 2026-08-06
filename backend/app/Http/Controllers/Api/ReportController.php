<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaseTimeline;
use App\Models\Report;
use App\Models\User;
use App\Services\CaseTimelineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(): JsonResponse
    {
        $reports = Report::with(['crimeType', 'zone', 'assignedOfficer'])
            ->orderByDesc('submitted_at')
            ->get()
            ->map(fn ($r) => DashboardController::formatReport($r));

        return response()->json(['data' => $reports]);
    }

    public function show(string $caseId): JsonResponse
    {
        $report = Report::with([
            'crimeType', 'category', 'zone', 'assignedOfficer', 'station',
            'timeline', 'investigationNotes.author', 'evidenceFiles',
        ])
            ->where('case_id', strtoupper($caseId))
            ->firstOrFail();

        $daysOpen = $report->submitted_at
            ? (int) $report->submitted_at->diffInDays(now())
            : 0;

        return response()->json([
            'data' => [
                'case_id' => $report->case_id,
                'crime_type' => $report->crimeType->name,
                'category' => $report->category->name,
                'status' => $report->status,
                'priority' => $report->priority,
                'location' => $report->location,
                'zone' => $report->zone->name,
                'latitude' => $report->latitude,
                'longitude' => $report->longitude,
                'incident_date' => $report->incident_date,
                'incident_time' => $report->incident_time,
                'description' => $report->description,
                'suspect_info' => $report->suspect_info,
                'witness_info' => $report->witness_info,
                'is_anonymous' => $report->is_anonymous,
                'reporter_name' => $report->is_anonymous ? null : $report->reporter_name,
                'reporter_phone' => $report->is_anonymous ? null : $report->reporter_phone,
                'reporter_email' => $report->is_anonymous ? null : $report->reporter_email,
                'officer' => $report->assignedOfficer?->name ?? 'Unassigned',
                'officer_id' => $report->assigned_officer_id,
                'station' => $report->station?->name,
                'filed_at' => $report->submitted_at,
                'days_open' => $daysOpen,
                'timeline' => $report->timeline->map(fn ($t) => [
                    'event' => $t->event_type,
                    'note' => $t->note,
                    'date' => $t->created_at,
                ]),
                'notes' => $report->investigationNotes->map(fn ($n) => [
                    'author' => $n->author?->name ?? 'Officer',
                    'date' => $n->created_at,
                    'text' => $n->note,
                ]),
                'evidence' => $report->evidenceFiles->map(fn ($e) => EvidenceController::formatEvidence($e)),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:crime_categories,id',
            'crime_type_id' => 'required|exists:crime_types,id',
            'incident_date' => 'required|date',
            'incident_time' => 'nullable',
            'location' => 'required|string|max:255',
            'zone_id' => 'required|exists:zones,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'description' => 'required|string',
            'suspect_info' => 'nullable|string',
            'witness_info' => 'nullable|string',
            'is_anonymous' => 'boolean',
            'reporter_name' => 'nullable|string|max:150',
            'reporter_phone' => 'nullable|string|max:30',
            'reporter_email' => 'nullable|email|max:150',
        ]);

        $report = DB::transaction(function () use ($validated, $request) {
            $caseId = $this->generateCaseId();

            $report = Report::create([
                ...$validated,
                'case_id' => $caseId,
                'status' => 'submitted',
                'priority' => 'medium',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            CaseTimeline::create([
                'report_id' => $report->id,
                'event_type' => 'submitted',
                'note' => 'Report received and logged into ECRS Koforidua.',
                'created_at' => now(),
            ]);

            return $report;
        });

        return response()->json([
            'message' => 'Report submitted successfully.',
            'case_id' => $report->case_id,
            'status' => $report->status,
        ], 201);
    }

    public function update(Request $request, string $caseId): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:submitted,assigned,under_investigation,pending_review,resolved,closed',
            'priority' => 'sometimes|in:low,medium,high,critical',
            'assigned_officer_id' => 'sometimes|nullable|exists:users,id',
            'station_id' => 'sometimes|nullable|exists:police_stations,id',
            'resolution_summary' => 'sometimes|nullable|string|max:5000',
        ]);

        $report = Report::with('assignedOfficer')
            ->where('case_id', strtoupper($caseId))
            ->firstOrFail();

        $user = $request->user();

        DB::transaction(function () use ($report, $validated, $user) {
            $originalStatus = $report->status;
            $originalPriority = $report->priority;
            $originalOfficerId = $report->assigned_officer_id;

            if (array_key_exists('assigned_officer_id', $validated)) {
                $newOfficerId = $validated['assigned_officer_id'];
                if ($newOfficerId !== $originalOfficerId) {
                    $officer = $newOfficerId ? User::find($newOfficerId) : null;
                    $event = $originalOfficerId ? 'reassigned' : 'assigned';
                    CaseTimelineService::log(
                        $report,
                        $event,
                        $user,
                        $officer
                            ? "Case assigned to {$officer->name}."
                            : 'Case officer assignment cleared.',
                        (string) $originalOfficerId,
                        (string) $newOfficerId,
                    );
                    if ($newOfficerId && $report->status === 'submitted') {
                        $validated['status'] = 'assigned';
                    }
                }
            }

            if (isset($validated['priority']) && $validated['priority'] !== $originalPriority) {
                CaseTimelineService::log(
                    $report,
                    'priority_changed',
                    $user,
                    "Priority changed from {$originalPriority} to {$validated['priority']}.",
                    $originalPriority,
                    $validated['priority'],
                );
            }

            if (isset($validated['status']) && $validated['status'] !== $originalStatus) {
                $eventType = match ($validated['status']) {
                    'resolved' => 'resolved',
                    'closed' => 'closed',
                    default => 'status_changed',
                };

                CaseTimelineService::log(
                    $report,
                    $eventType,
                    $user,
                    "Status changed from {$originalStatus} to {$validated['status']}.",
                    $originalStatus,
                    $validated['status'],
                );

                if ($validated['status'] === 'resolved') {
                    $validated['resolved_at'] = now();
                }
                if ($validated['status'] === 'closed') {
                    $validated['closed_at'] = now();
                }
            }

            $report->update($validated);
        });

        $report->refresh()->load(['assignedOfficer', 'station']);

        return response()->json([
            'message' => 'Report updated successfully.',
            'data' => [
                'case_id' => $report->case_id,
                'status' => $report->status,
                'priority' => $report->priority,
                'officer' => $report->assignedOfficer?->name ?? 'Unassigned',
                'officer_id' => $report->assigned_officer_id,
                'station' => $report->station?->name,
                'resolution_summary' => $report->resolution_summary,
                'resolved_at' => $report->resolved_at,
                'closed_at' => $report->closed_at,
            ],
        ]);
    }

    public function track(string $caseId): JsonResponse
    {
        $report = Report::with(['crimeType', 'zone', 'assignedOfficer', 'timeline'])
            ->where('case_id', strtoupper($caseId))
            ->firstOrFail();

        return response()->json([
            'data' => [
                'case_id' => $report->case_id,
                'crime_type' => $report->crimeType->name,
                'location' => $report->location,
                'zone' => $report->zone->name,
                'status' => $report->status,
                'officer' => $report->assignedOfficer?->name ?? 'Unassigned',
                'filed_at' => $report->submitted_at,
                'timeline' => $report->timeline->map(fn ($t) => [
                    'event' => $t->event_type,
                    'note' => $t->note,
                    'date' => $t->created_at,
                ]),
            ],
        ]);
    }

    private function generateCaseId(): string
    {
        do {
            $id = 'KFD-'.date('Y').'-'.random_int(100000, 999999);
        } while (Report::where('case_id', $id)->exists());

        return $id;
    }
}
