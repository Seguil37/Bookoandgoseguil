<?php

use Illuminate\Support\Facades\Route;

// Todas las rutas deben devolver la vista principal de React
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');