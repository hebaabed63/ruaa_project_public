<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role)
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'غير مسموح لك بالوصول لهذه البيانات'
            ], 401);
        }

        // Convert role parameter to integer if it's a string
        $requiredRole = $this->convertRole($role);
        
        // Check if user has the required role
        if ($request->user()->role !== $requiredRole) {
            return response()->json([
                'success' => false,
                'message' => 'غير مسموح لك بالوصول لهذه البيانات'
            ], 403);
        }

        return $next($request);
    }

    /**
     * Convert role string to integer
     *
     * @param string $role
     * @return int
     */
    private function convertRole($role)
    {
        // If it's already an integer, return it
        if (is_numeric($role)) {
            return (int) $role;
        }

        // Map role names to integers
        $roles = [
            'admin' => 0,
            'supervisor' => 1,
            'school_manager' => 2,
            'parent' => 3
        ];

        return $roles[$role] ?? 3; // Default to parent role
    }
}