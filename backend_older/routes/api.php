<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChildrenController;
use App\Http\Controllers\SharedCareController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\NotificationController;

// Rota de teste mínima
Route::get('ping', [TestController::class, 'ping']);

// Rotas públicas
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

// Rotas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function() {

    // Crianças
    Route::apiResource('children', ChildrenController::class);

    // Eventos de guarda compartilhada
    Route::apiResource('shared-care-events', SharedCareController::class);

    // Transações financeiras
    Route::apiResource('transactions', TransactionController::class);

    // Notificações
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/mark-read/{id}', [NotificationController::class, 'markRead']);

    // Logout
    Route::post('logout', [AuthController::class, 'logout']);
});
