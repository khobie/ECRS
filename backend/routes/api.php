<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EvidenceController;
use App\Http\Controllers\Api\InvestigationNoteController;
use App\Http\Controllers\Api\LookupController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Health check — test that API is running
Route::get('/health', fn () => response()->json([
    'status' => 'ok',
    'app' => 'ECRS API',
    'municipality' => 'Koforidua',
    'time' => now()->toIso8601String(),
]));

// Public lookup data (for report form dropdowns)
Route::get('/zones', [LookupController::class, 'zones']);
Route::get('/categories', [LookupController::class, 'categories']);

// Public stats
Route::get('/landing/stats', [DashboardController::class, 'landingStats']);

// Public citizen endpoints
Route::post('/reports', [ReportController::class, 'store']);
Route::get('/reports/track/{caseId}', [ReportController::class, 'track']);

// Officer authentication
Route::post('/login', [AuthController::class, 'login']);

// Protected officer endpoints
Route::middleware(['auth:sanctum', 'officer.active'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/analytics', [AnalyticsController::class, 'index']);
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/{caseId}', [ReportController::class, 'show']);
    Route::patch('/reports/{caseId}', [ReportController::class, 'update']);
    Route::post('/reports/{caseId}/notes', [InvestigationNoteController::class, 'store']);
    Route::post('/reports/{caseId}/evidence', [EvidenceController::class, 'store']);
    Route::get('/reports/{caseId}/evidence/{id}', [EvidenceController::class, 'show']);

    Route::get('/officers', [UserController::class, 'officers']);
    Route::get('/users', [UserController::class, 'index']);

    Route::middleware('role:super_admin,police_commander')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::patch('/users/{user}', [UserController::class, 'update']);
    });
});
