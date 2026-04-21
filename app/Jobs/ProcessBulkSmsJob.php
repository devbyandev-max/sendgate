<?php

namespace App\Jobs;

use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessBulkSmsJob implements ShouldQueue
{
    use Batchable, Queueable;

    /**
     * @param  array<int, string>  $recipients
     */
    public function __construct(
        public int $simId,
        public array $recipients,
        public string $message,
    ) {}

    public function handle(): void
    {
        foreach ($this->recipients as $to) {
            SendSmsJob::dispatch($this->simId, $to, $this->message);
        }
    }
}
