<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function pricing(): Response
    {
        return Inertia::render('marketing/pricing');
    }

    public function features(): Response
    {
        return Inertia::render('marketing/features');
    }

    public function faq(): Response
    {
        return Inertia::render('marketing/faq');
    }

    public function terms(): Response
    {
        return Inertia::render('marketing/terms');
    }

    public function privacy(): Response
    {
        return Inertia::render('marketing/privacy');
    }
}
