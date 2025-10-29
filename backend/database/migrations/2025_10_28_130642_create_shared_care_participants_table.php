<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('shared_care_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shared_care_event_id')->constrained('shared_care_events')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('share_percentage')->default(0);
            $table->enum('payment_status',['pending','paid'])->default('pending');
            $table->enum('accepted_status',['pending','accepted','declined'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('shared_care_participants');
    }
};
