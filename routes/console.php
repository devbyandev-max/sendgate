<?php

use App\Jobs\GenerateInvoicesJob;
use App\Jobs\ProcessScheduledMessagesJob;
use App\Jobs\SendOverdueRemindersJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new ProcessScheduledMessagesJob)->everyMinute()->name('scheduled-messages');
Schedule::job(new GenerateInvoicesJob)->monthlyOn(1, '00:05')->name('generate-invoices');
Schedule::job(new SendOverdueRemindersJob)->dailyAt('09:00')->name('overdue-reminders');
