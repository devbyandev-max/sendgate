<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\App as Customer;
use App\Http\Controllers\Marketing\DocsController;
use App\Http\Controllers\Marketing\HomeController;
use App\Http\Controllers\Marketing\PageController;
use Illuminate\Support\Facades\Route;

// =============================================
// Marketing site
// =============================================
Route::get('/', HomeController::class)->name('home');
Route::get('/pricing', [PageController::class, 'pricing'])->name('pricing');
Route::get('/features', [PageController::class, 'features'])->name('features');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');
Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/docs', DocsController::class)->name('docs');

// =============================================
// Customer dashboard
// =============================================
Route::middleware(['auth', 'verified'])->prefix('app')->name('app.')->group(function () {
    Route::get('dashboard', [Customer\DashboardController::class, 'index'])->name('dashboard');

    Route::get('sims', [Customer\SimController::class, 'index'])->name('sims.index');
    Route::get('sims/{sim}', [Customer\SimController::class, 'show'])->name('sims.show');

    Route::get('sms/send', [Customer\SmsController::class, 'create'])->name('sms.create');
    Route::post('sms/send', [Customer\SmsController::class, 'store'])->name('sms.store');
    Route::post('sms/bulk', [Customer\SmsController::class, 'bulkStore'])->name('sms.bulk');
    Route::get('sms/inbox', [Customer\InboxController::class, 'index'])->name('sms.inbox');
    Route::get('sms/outbox', [Customer\OutboxController::class, 'index'])->name('sms.outbox.index');
    Route::get('sms/scheduled', [Customer\ScheduledMessageController::class, 'index'])->name('sms.scheduled.index');
    Route::post('sms/scheduled', [Customer\ScheduledMessageController::class, 'store'])->name('sms.scheduled.store');
    Route::delete('sms/scheduled/{message}', [Customer\ScheduledMessageController::class, 'destroy'])->name('sms.scheduled.destroy');

    Route::get('campaigns', [Customer\CampaignController::class, 'index'])->name('campaigns.index');

    Route::get('contacts', [Customer\ContactController::class, 'index'])->name('contacts.index');
    Route::post('contacts', [Customer\ContactController::class, 'store'])->name('contacts.store');
    Route::delete('contacts/{contact}', [Customer\ContactController::class, 'destroy'])->name('contacts.destroy');
    Route::post('contacts/import', [Customer\ContactController::class, 'import'])->name('contacts.import');
    Route::get('contacts/groups', [Customer\ContactGroupController::class, 'index'])->name('contacts.groups.index');

    Route::get('api-keys', [Customer\ApiKeyController::class, 'index'])->name('api-keys.index');
    Route::post('api-keys', [Customer\ApiKeyController::class, 'store'])->name('api-keys.store');
    Route::delete('api-keys/{apiKey}', [Customer\ApiKeyController::class, 'destroy'])->name('api-keys.destroy');

    Route::get('webhooks', [Customer\WebhookController::class, 'index'])->name('webhooks.index');
    Route::post('webhooks', [Customer\WebhookController::class, 'store'])->name('webhooks.store');
    Route::delete('webhooks/{webhook}', [Customer\WebhookController::class, 'destroy'])->name('webhooks.destroy');

    Route::get('analytics', [Customer\AnalyticsController::class, 'index'])->name('analytics');

    Route::get('billing', [Customer\BillingController::class, 'index'])->name('billing.index');
    Route::get('billing/invoices/{invoice}', [Customer\BillingController::class, 'show'])->name('billing.invoices.show');
    Route::get('billing/invoices/{invoice}/pdf', [Customer\BillingController::class, 'downloadPdf'])->name('billing.invoices.pdf');
    Route::post('billing/invoices/{invoice}/proof', [Customer\PaymentProofController::class, 'store'])->name('billing.proof.store');

    Route::get('settings', [Customer\SettingsController::class, 'edit'])->name('settings.edit');
});

// Legacy alias for the starter `dashboard` route — points at the new app dashboard.
Route::middleware(['auth', 'verified'])->get('dashboard', [Customer\DashboardController::class, 'index'])->name('dashboard');

// =============================================
// Admin panel
// =============================================
Route::middleware(['auth', 'verified', 'role:admin|super_admin'])
    ->prefix('admin')->name('admin.')
    ->group(function () {
        Route::get('dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

        Route::get('customers', [Admin\CustomerController::class, 'index'])->name('customers.index');
        Route::get('customers/{customer}', [Admin\CustomerController::class, 'show'])->name('customers.show');
        Route::post('customers/{customer}/suspend', [Admin\CustomerController::class, 'suspend'])->name('customers.suspend');
        Route::post('customers/{customer}/activate', [Admin\CustomerController::class, 'activate'])->name('customers.activate');

        Route::get('sims', [Admin\SimController::class, 'index'])->name('sims.index');
        Route::post('sims', [Admin\SimController::class, 'store'])->name('sims.store');
        Route::post('sims/{sim}/assign', [Admin\SimController::class, 'assign'])->name('sims.assign');
        Route::post('sims/{sim}/activate', [Admin\SimController::class, 'activate'])->name('sims.activate');

        Route::get('messages', [Admin\MessageController::class, 'index'])->name('messages.index');
        Route::get('invoices', [Admin\InvoiceController::class, 'index'])->name('invoices.index');

        Route::get('payments', [Admin\PaymentProofController::class, 'index'])->name('payments.index');
        Route::post('payments/{proof}/approve', [Admin\PaymentProofController::class, 'approve'])->name('payments.approve');
        Route::post('payments/{proof}/reject', [Admin\PaymentProofController::class, 'reject'])->name('payments.reject');

        Route::get('analytics', [Admin\AnalyticsController::class, 'index'])->name('analytics');

        Route::get('announcements', [Admin\AnnouncementController::class, 'index'])->name('announcements.index');
        Route::post('announcements', [Admin\AnnouncementController::class, 'store'])->name('announcements.store');
        Route::delete('announcements/{announcement}', [Admin\AnnouncementController::class, 'destroy'])->name('announcements.destroy');

        Route::get('admins', [Admin\AdminUserController::class, 'index'])->name('admins.index');
        Route::post('admins', [Admin\AdminUserController::class, 'store'])->name('admins.store');

        Route::get('settings', [Admin\SettingsController::class, 'edit'])->name('settings.edit');
        Route::post('settings', [Admin\SettingsController::class, 'update'])->name('settings.update');

        Route::get('activity-logs', [Admin\ActivityLogController::class, 'index'])->name('activity-logs');
    });

require __DIR__.'/settings.php';
