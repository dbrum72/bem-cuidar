<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TutorInviteController;
use App\Http\Controllers\DependentController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\NotificationController;

// ROTAS DE AUTENTICAÇÃO
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    Route::post('register', [UserController::class, 'store']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});

// ROTAS PROTEGIDAS (jwt.auth)
Route::group(['middleware' => ['api', 'jwt.auth']], function () {
    
    // Tutor - Convite
    Route::get('tutor-invite', [TutorInviteController::class, 'index'])->middleware('role:tutor|admin');
    Route::post('tutor-invite', [TutorInviteController::class, 'store'])->middleware('role:tutor|admin');
    Route::post('tutor-invite/{id}/resend', [TutorInviteController::class, 'resend'])->middleware('role:tutor|admin');
    Route::delete('tutor-invite/{id}', [TutorInviteController::class, 'destroy'])->middleware('role:admin');

    // Crianças
    Route::apiResource('dependent', DependentController::class);

    // Agendamentos
    Route::apiResource('appointment', AppointmentController::class);

    // Transações financeiras
    Route::apiResource('transactions', TransactionController::class);

    // Notificações
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/mark-read/{id}', [NotificationController::class, 'markRead']);

    // User
    Route::apiResource('user', UserController::class)->only(['index', 'show', 'update', 'destroy']);
});

// Tutor - Aceite (sem autenticação)
Route::get('/invite/accept/{token}', [TutorInviteController::class, 'accept'])
    ->name('tutor-invite.accept');
