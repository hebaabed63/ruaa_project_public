<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Response;

class CsrfCookieController extends Controller
{
    public function show(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['csrf_token' => csrf_token()]);
        }

        return response()->noContent();
    }
}
