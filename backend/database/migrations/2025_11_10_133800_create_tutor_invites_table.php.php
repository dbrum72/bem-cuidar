<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTutorInvitesTable extends Migration {

    public function up() {

        Schema::create('tutor_invites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inviter_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('dependent_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('tutor_id')->nullable()->index();
            $table->string('tutor_email')->index();
            $table->string('token', 100)->unique();
            $table->enum('status', ['pendente','aceito','recusado','cancelado'])->default('pendente');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();

            // tutor_id points to users when present
            $table->foreign('tutor_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down() {
        Schema::disableForeignKeyConstraints();
        
        Schema::dropIfExists('tutor_invites');

        Schema::enableForeignKeyConstraints();
    }
}
