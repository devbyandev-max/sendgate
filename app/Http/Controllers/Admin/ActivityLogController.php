<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(): Response
    {
        $logs = Activity::with('causer:id,name,email')->latest()->paginate(50);

        return Inertia::render('admin/activity-logs', ['logs' => $logs]);
    }
}
