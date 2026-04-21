<?php

use App\Models\Webhook;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('webhook_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Webhook::class)->constrained()->cascadeOnDelete();
            $table->string('event');
            $table->json('payload');
            $table->unsignedInteger('response_code')->nullable();
            $table->text('response_body')->nullable();
            $table->timestamp('attempted_at');
            $table->boolean('succeeded')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('webhook_deliveries');
    }
};
