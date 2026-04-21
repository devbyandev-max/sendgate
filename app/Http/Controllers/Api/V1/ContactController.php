<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->contacts()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $validator = validator($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'regex:/^(\\+63|0)9\\d{9}$/',
                Rule::unique('contacts', 'phone_number')->where(fn ($q) => $q->where('user_id', $user->id)),
            ],
            'email' => ['nullable', 'email'],
            'tags' => ['nullable', 'array'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => ['code' => 'validation_failed', 'message' => 'Validation failed.', 'details' => $validator->errors()->toArray()],
            ], 422);
        }

        $contact = Contact::create([...$validator->validated(), 'user_id' => $user->id]);

        return response()->json(['data' => $contact], 201);
    }
}
