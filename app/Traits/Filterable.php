<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait Filterable
{
    /**
     * Apply filters dynamically from request parameters.
     */
    public function scopeFilter($query, Request $request)
    {
        // هنا بتحط كل الفلاتر المحتملة
        $filters = [
            'region'       => 'byRegion',
            'city'         => 'byCity',
            'directorate'  => 'byDirectorate',
            'type'         => 'bySchoolType',
            'level'        => 'byLevel',
            'minRating'    => 'minRating',
        ];

        foreach ($filters as $param => $scopeMethod) {
            if ($request->has($param) && filled($request->$param)) {
                // مثال: byRegion($value)
                $query->$scopeMethod($request->$param);
            }
        }

        return $query;
    }
}
