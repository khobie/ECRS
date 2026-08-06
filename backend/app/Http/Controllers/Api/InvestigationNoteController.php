<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InvestigationNote;
use App\Models\Report;
use App\Services\CaseTimelineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvestigationNoteController extends Controller
{
    public function store(Request $request, string $caseId): JsonResponse
    {
        $validated = $request->validate([
            'note' => 'required|string|max:5000',
        ]);

        $report = Report::where('case_id', strtoupper($caseId))->firstOrFail();
        $user = $request->user();

        $note = InvestigationNote::create([
            'report_id' => $report->id,
            'author_id' => $user->id,
            'note' => $validated['note'],
            'is_internal' => true,
        ]);

        CaseTimelineService::log(
            $report,
            'note_added',
            $user,
            $validated['note'],
        );

        $note->load('author');

        return response()->json([
            'message' => 'Note added successfully.',
            'data' => [
                'id' => $note->id,
                'author' => $note->author->name,
                'date' => $note->created_at,
                'text' => $note->note,
            ],
        ], 201);
    }
}
