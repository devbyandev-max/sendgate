<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactGroupController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('app/contacts/groups', [
            'groups' => $request->user()->contactGroups()->withCount('contacts')->get(),
        ]);
    }
}
