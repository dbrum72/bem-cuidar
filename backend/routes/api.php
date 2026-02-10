<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TutorInviteController;
use App\Http\Controllers\DependentController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentFileController;
use App\Http\Controllers\RelationshipController;
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
    Route::get('invite', [TutorInviteController::class, 'index'])/*->middleware('role:tutor|admin')*/;
    Route::post('invite', [TutorInviteController::class, 'store'])/*->middleware('role:tutor|admin')*/;
    Route::post('invite/{id}/resend', [TutorInviteController::class, 'resend'])->middleware('role:tutor|admin');
    Route::delete('invite/{id}', [TutorInviteController::class, 'destroy'])->middleware('role:admin');

    // Dependente
    Route::apiResource('dependent', DependentController::class);

    // Agendamento
    Route::apiResource('appointment', AppointmentController::class);

    // Agendamento - Arquivos
    Route::apiResource('appointment/file', AppointmentFileController::class)->only(['store', 'destroy']);

    // Relacionamento
    Route::apiResource('relationship', RelationshipController::class)->only(['store', 'update', 'show', 'destroy']);
    Route::get('relationship/getTutors/{dependentId}', [RelationshipController::class, 'getTutorsByDependent']);
    
    // Transações financeiras
    
    Route::apiResource('transactions', TransactionController::class);

    // Notificações
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/mark-read/{id}', [NotificationController::class, 'markRead']);

    // User
    Route::apiResource('user', UserController::class)->only(['index', 'show', 'update', 'destroy']);
});

// Tutor - Aceite (sem autenticação)
Route::get('invite/accept/{token}', [TutorInviteController::class, 'accept'])
    ->name('invite-accept');
