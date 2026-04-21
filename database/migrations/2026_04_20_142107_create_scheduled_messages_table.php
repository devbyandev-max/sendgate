<?php

use App\Models\Sim;
use App\Models\SmsMessage;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scheduled_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Sim::class)->constrained()->cascadeOnDelete();
            $table->string('to_number');
            $table->text('message');
            $table->timestamp('scheduled_at');
            $table->string('status')->default('pending');
            $table->timestamp('sent_at')->nullable();
            $table->foreignIdFor(SmsMessage::class)->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheduled_messages');
    }
};
