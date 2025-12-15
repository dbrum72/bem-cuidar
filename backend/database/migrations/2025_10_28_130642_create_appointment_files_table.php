<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    
    public function up(): void {
        Schema::create('appointment_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade');
            $table->string('filename');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('appointment_files');

        Schema::enableForeignKeyConstraints();
    }
};
