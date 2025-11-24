<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TourController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\AgencyController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\BookingDocumentController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\SystemSettingsController;

/*
|--------------------------------------------------------------------------
| API Routes - BOOK&GO
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // ===== AUTENTICACIÓN (sin auth:sanctum) =====
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        
        // Rutas protegidas de auth
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
        });
    });
    
    // ===== RUTAS PÚBLICAS (sin autenticación) =====
    Route::group([], function () {
        // Tours (listado público)
        Route::get('/tours', [TourController::class, 'index']);
        Route::get('/tours/featured', [TourController::class, 'featured']);
        Route::get('/tours/{id}', [TourController::class, 'show']);
        Route::get('/tours/{id}/related', [TourController::class, 'related']);
        
        // Categorías
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/categories/{slug}', [CategoryController::class, 'show']);
        
        // Agencias (listado público)
        Route::get('/agencies', [AgencyController::class, 'index']);
        Route::get('/agencies/{id}', [AgencyController::class, 'show']);
        
        // Reseñas (listado público)
        Route::get('/reviews', [ReviewController::class, 'index']);
        
        // Configuraciones públicas del sistema
        Route::get('/settings/public', [SystemSettingsController::class, 'public']);
        
        // Validar cupón (público)
        Route::post('/coupons/validate', [CouponController::class, 'validate']);
    });

    // ===== RUTAS PROTEGIDAS (requieren autenticación) =====
    Route::middleware(['auth:sanctum'])->group(function () {
        
        // --- CLIENTE: Favoritos ---
        Route::middleware(['role:customer'])->group(function () {
            Route::get('/favorites', [FavoriteController::class, 'index']);
            Route::post('/favorites/{tourId}/toggle', [FavoriteController::class, 'toggle']);
        });
        
        // --- CLIENTE: Reservas ---
        Route::middleware(['role:customer,admin'])->group(function () {
            Route::get('/bookings', [BookingController::class, 'index']);
            Route::get('/bookings/{id}', [BookingController::class, 'show']);
            Route::post('/bookings', [BookingController::class, 'store']);
            Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
        });
        
        // --- DOCUMENTOS DE RESERVA ---
        Route::prefix('bookings/{bookingId}/documents')->group(function () {
            Route::get('/', [BookingDocumentController::class, 'index']);
            Route::get('/voucher', [BookingDocumentController::class, 'generateVoucher']);
            Route::post('/invoice', [BookingDocumentController::class, 'generateInvoice']);
            Route::get('/{documentId}/download', [BookingDocumentController::class, 'download']);
            Route::delete('/{documentId}', [BookingDocumentController::class, 'destroy'])
                ->middleware('role:agency,admin');
        });
        
        // --- MENSAJERÍA ---
        Route::prefix('messages')->group(function () {
            Route::get('/conversations', [MessageController::class, 'conversations']);
            Route::get('/unread-count', [MessageController::class, 'unreadCount']);
        });
        
        Route::prefix('bookings/{bookingId}/messages')->group(function () {
            Route::get('/', [MessageController::class, 'index']);
            Route::post('/', [MessageController::class, 'store']);
            Route::post('/mark-all-read', [MessageController::class, 'markAllAsRead']);
            Route::delete('/{messageId}', [MessageController::class, 'destroy']);
        });
        
        // --- CLIENTE: Reseñas ---
        Route::middleware(['role:customer'])->group(function () {
            Route::post('/reviews', [ReviewController::class, 'store']);
        });
        
        // Marcar reseña como útil (todos los usuarios autenticados)
        Route::post('/reviews/{id}/helpful', [ReviewController::class, 'markHelpful']);
        
        // --- AGENCIA: Tours ---
        Route::middleware(['role:agency', 'agency', 'track'])->group(function () {
            Route::post('/tours', [TourController::class, 'store']);
            Route::put('/tours/{id}', [TourController::class, 'update']);
            Route::delete('/tours/{id}', [TourController::class, 'destroy']);
            Route::post('/tours/{id}/publish', [TourController::class, 'publish']);
            
            // Dashboard de agencia
            Route::get('/agency/dashboard', [AgencyController::class, 'dashboard']);
            Route::get('/agency/bookings', [AgencyController::class, 'bookings']);
            Route::get('/agency/tours', [AgencyController::class, 'tours']);
            Route::get('/agency/statistics', [AgencyController::class, 'statistics']);
            Route::put('/agency/profile', [AgencyController::class, 'update']);
            
            // Gestión de reservas
            Route::post('/bookings/{id}/confirm', [BookingController::class, 'confirm']);
            Route::post('/bookings/{id}/check-in', [BookingController::class, 'checkIn']);
            Route::post('/bookings/{id}/complete', [BookingController::class, 'complete']);
        });
        
        // --- PAGOS (cliente y agencia) ---
        Route::middleware(['role:customer,agency,admin'])->group(function () {
            Route::post('/payments', [PaymentController::class, 'create']);
            Route::post('/payments/{id}/confirm', [PaymentController::class, 'confirm']);
            Route::get('/payments/{id}', [PaymentController::class, 'show']);
        });
        
        // --- ADMIN: Cupones ---
        Route::middleware(['role:admin'])->prefix('admin/coupons')->group(function () {
            Route::get('/', [CouponController::class, 'index']);
            Route::post('/', [CouponController::class, 'store']);
            Route::get('/statistics', [CouponController::class, 'statistics']);
            Route::get('/{id}', [CouponController::class, 'show']);
            Route::put('/{id}', [CouponController::class, 'update']);
            Route::delete('/{id}', [CouponController::class, 'destroy']);
            Route::post('/{id}/toggle-status', [CouponController::class, 'toggleStatus']);
        });
        
        // --- ADMIN: Configuraciones del Sistema ---
        Route::middleware(['role:admin'])->prefix('admin/settings')->group(function () {
            Route::get('/', [SystemSettingsController::class, 'index']);
            Route::post('/', [SystemSettingsController::class, 'store']);
            Route::get('/export', [SystemSettingsController::class, 'export']);
            Route::post('/import', [SystemSettingsController::class, 'import']);
            Route::post('/clear-cache', [SystemSettingsController::class, 'clearCache']);
            Route::get('/group/{group}', [SystemSettingsController::class, 'getByGroup']);
            Route::put('/group/{group}', [SystemSettingsController::class, 'updateGroup']);
            Route::get('/{key}', [SystemSettingsController::class, 'show']);
            Route::put('/{key}', [SystemSettingsController::class, 'update']);
            Route::delete('/{key}', [SystemSettingsController::class, 'destroy']);
        });
    });
});