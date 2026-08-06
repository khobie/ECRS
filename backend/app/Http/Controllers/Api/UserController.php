<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    private const ROLE_LABELS = [
        'super_admin' => 'Super Admin',
        'police_commander' => 'Police Commander',
        'investigator' => 'Investigator',
        'station_officer' => 'Station Officer',
    ];

    public function index(): JsonResponse
    {
        $users = User::with('station')
            ->orderBy('name')
            ->get()
            ->map(fn ($u) => $this->formatUser($u));

        return response()->json(['data' => $users]);
    }

    public function officers(): JsonResponse
    {
        $officers = User::whereIn('role', ['investigator', 'station_officer', 'police_commander'])
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'rank', 'station_id']);

        return response()->json(['data' => $officers]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(array_keys(self::ROLE_LABELS))],
            'station_id' => 'nullable|exists:police_stations,id',
            'rank' => 'nullable|string|max:80',
            'badge_number' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:30',
        ]);

        $user = User::create([
            ...$validated,
            'status' => 'active',
        ]);

        $user->load('station');

        return response()->json([
            'message' => 'User created successfully.',
            'data' => $this->formatUser($user),
        ], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'email' => ['sometimes', 'email', 'max:150', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'sometimes|string|min:8',
            'role' => ['sometimes', Rule::in(array_keys(self::ROLE_LABELS))],
            'station_id' => 'sometimes|nullable|exists:police_stations,id',
            'rank' => 'sometimes|nullable|string|max:80',
            'badge_number' => 'sometimes|nullable|string|max:50',
            'phone' => 'sometimes|nullable|string|max:30',
            'status' => ['sometimes', Rule::in(['active', 'disabled'])],
        ]);

        $user->update($validated);
        $user->load('station');

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => $this->formatUser($user),
        ]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => self::ROLE_LABELS[$user->role] ?? ucfirst(str_replace('_', ' ', $user->role)),
            'station' => $user->station?->name ?? '—',
            'status' => ucfirst($user->status),
            'lastActive' => $user->last_active_at ?? $user->updated_at,
        ];
    }
}
