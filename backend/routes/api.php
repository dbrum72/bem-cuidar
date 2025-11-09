<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group([

    'namespace' => 'App\Http\Controllers',
    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('register', 'AuthController@register');
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');    
});

Route::group([

    'namespace' => 'App\Http\Controllers',
    'middleware' => ['api','jwt.auth']

], function ($router) {

    // Tutor - Convite
    Route::post('/dependents/{id}/invite-tutor', 'TutorInviteController@sendInvite');
    Route::get('/dependents/{id}/tutors', 'TutorInviteController@listTutors');

    // Crianças
    Route::apiResource('dependent', 'DependentController');

    // Agendamentos de guarda compartilhada
    Route::apiResource('appointment', 'AppointmentController');

    // Transações financeiras
    Route::apiResource('transactions', 'TransactionController');

    // Notificações
    Route::get('notifications', 'NotificationController@index');
    Route::post('notifications/mark-read/{id}', 'NotificationController@markRead');
    
});

// Tutor - Aceite
Route::get('/tutor/accept/{token}', [TutorInviteController::class, 'acceptInvite']);
