<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;


class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating'  => 'required|integer|in:1,2,3',
            'mood'    => 'nullable|string|in:sad,neutral,happy',
            'comment' => 'nullable|string|max:500',
        ]);

        $feedback = Feedback::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال تقييمك بنجاح، شكرًا لملاحظاتك!',
            'data' => $feedback,
        ], 201);
    }

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Feedback::latest()->get(),
        ]);
    }}
