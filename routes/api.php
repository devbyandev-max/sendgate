<?php

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\SimController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['api.key', 'throttle:60,1'])
    ->group(function () {
        // Messages
        Route::get('messages', [MessageController::class, 'index']);
        Route::post('messages', [MessageController::class, 'store']);
        Route::get('messages/{message}', [MessageController::class, 'show']);
        Route::post('messages/schedule', [MessageController::class, 'schedule']);

        // SIMs
        Route::get('sims', [SimController::class, 'index']);
        Route::get('sims/{sim}', [SimController::class, 'show']);
        Route::get('sims/{sim}/balance', [SimController::class, 'balance']);

        // Contacts
        Route::get('contacts', [ContactController::class, 'index']);
        Route::post('contacts', [ContactController::class, 'store']);

        // Account
        Route::get('account', [AccountController::class, 'show']);
    });
