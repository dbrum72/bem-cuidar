<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('auth/login', [AuthController::class, 'login']);

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

    // Crianças
    Route::apiResource('children', 'ChildController');

    // Eventos de guarda compartilhada
    Route::apiResource('shared-care-events', 'SharedCareEventController');

    // Transações financeiras
    Route::apiResource('transactions', 'TransactionController');

    // Notificações
    Route::get('notifications', 'NotificationController@index');
    Route::post('notifications/mark-read/{id}', 'NotificationController@markRead');
    
});
