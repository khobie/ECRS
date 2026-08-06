<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrimeCategory;
use App\Models\Zone;
use Illuminate\Http\JsonResponse;

class LookupController extends Controller
{
    public function zones(): JsonResponse
    {
        return response()->json([
            'municipality' => 'Koforidua',
            'data' => Zone::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug']),
        ]);
    }

    public function categories(): JsonResponse
    {
        $categories = CrimeCategory::with(['crimeTypes' => function ($q) {
            $q->where('is_active', true)->orderBy('sort_order')->select('id', 'category_id', 'name', 'slug');
        }])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug']);

        return response()->json(['data' => $categories]);
    }
}
