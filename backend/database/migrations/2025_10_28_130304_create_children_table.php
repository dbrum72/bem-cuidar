<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    
    public function up(): void {
        Schema::create('children', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->date('birth_date');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void {

        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('children');

        Schema::enableForeignKeyConstraints();
    }
};
