<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('app/campaigns/index', [
            'campaigns' => $request->user()->smsCampaigns()->latest()->get(),
        ]);
    }
}
