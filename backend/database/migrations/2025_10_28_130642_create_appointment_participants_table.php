<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    
    public function up(): void {
        Schema::create('appointment_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade');
            $table->foreignId('participant_id')->constrained('users')->onDelete('cascade');
            $table->integer('share_percentage')->default(0);
            $table->enum('payment_status',['pendente','pago'])->default('pendente');
            $table->enum('aceito_status',['pendente','aceito','recusado'])->default('pendente');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('appointment_participants');

        Schema::enableForeignKeyConstraints();
    }
};
