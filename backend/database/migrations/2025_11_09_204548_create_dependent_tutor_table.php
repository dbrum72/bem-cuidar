<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    
    public function up(): void {

        Schema::create('dependent_tutor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dependent_id')->constrained()->onDelete('cascade');
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->string('relationship_type')->nullable();
            $table->enum('status', ['pending', 'accepted'])->default('pending');
            $table->string('invite_token')->nullable()->unique();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {

        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('dependent_user');

        Schema::enableForeignKeyConstraints();
    }
};
