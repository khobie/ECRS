<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvidenceFile;
use App\Models\Report;
use App\Services\CaseTimelineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EvidenceController extends Controller
{
    private const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

    public function store(Request $request, string $caseId): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $report = Report::where('case_id', strtoupper($caseId))->firstOrFail();
        $file = $validated['file'];
        $user = $request->user();

        $storedName = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs("evidence/{$report->id}", $storedName, 'local');

        $evidence = EvidenceFile::create([
            'report_id' => $report->id,
            'uploaded_by' => $user->id,
            'file_type' => $this->detectFileType($file->getMimeType()),
            'original_name' => $file->getClientOriginalName(),
            'stored_name' => $storedName,
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'checksum' => hash_file('sha256', $file->getRealPath()),
        ]);

        CaseTimelineService::log(
            $report,
            'evidence_uploaded',
            $user,
            "Evidence uploaded: {$evidence->original_name}",
            metadata: ['evidence_id' => $evidence->id],
        );

        return response()->json([
            'message' => 'Evidence uploaded successfully.',
            'data' => $this->formatEvidence($evidence),
        ], 201);
    }

    public function show(string $caseId, int $id): StreamedResponse
    {
        $report = Report::where('case_id', strtoupper($caseId))->firstOrFail();

        $evidence = EvidenceFile::where('report_id', $report->id)
            ->where('id', $id)
            ->firstOrFail();

        if (! Storage::disk('local')->exists($evidence->file_path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('local')->download(
            $evidence->file_path,
            $evidence->original_name,
            ['Content-Type' => $evidence->mime_type],
        );
    }

    private function detectFileType(string $mime): string
    {
        if (str_starts_with($mime, 'image/')) {
            return 'photo';
        }
        if (str_starts_with($mime, 'video/')) {
            return 'video';
        }
        if (str_starts_with($mime, 'audio/')) {
            return 'audio';
        }

        return 'document';
    }

    public static function formatEvidence(EvidenceFile $evidence): array
    {
        return [
            'id' => $evidence->id,
            'name' => $evidence->original_name,
            'type' => $evidence->file_type === 'photo' ? 'image' : $evidence->file_type,
            'size' => $evidence->file_size,
            'mime_type' => $evidence->mime_type,
        ];
    }
}
