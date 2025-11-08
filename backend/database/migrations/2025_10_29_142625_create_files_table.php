<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    
    public function up(): void {

        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('storaged', 255);
            $table->foreignId('dependent_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /*******************************************************************************/

    public function down(): void {

        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('files');

        Schema::enableForeignKeyConstraints();
    }
};
