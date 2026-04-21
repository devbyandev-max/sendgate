<?php

use App\Models\Contact;
use App\Models\ContactGroup;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_group_members', function (Blueprint $table) {
            $table->foreignIdFor(Contact::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(ContactGroup::class)->constrained()->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->primary(['contact_id', 'contact_group_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_group_members');
    }
};
