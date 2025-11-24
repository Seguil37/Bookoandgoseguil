<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Tour;
use App\Models\Booking;
use App\Models\Review;
use App\Policies\TourPolicy;
use App\Policies\BookingPolicy;
use App\Policies\ReviewPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Tour::class => TourPolicy::class,
        Booking::class => BookingPolicy::class,
        Review::class => ReviewPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Gates personalizados (opcionales)
        \Illuminate\Support\Facades\Gate::define('manage-system', function ($user) {
            return $user->isAdmin();
        });

        \Illuminate\Support\Facades\Gate::define('manage-agency', function ($user) {
            return $user->isAgency() && $user->agency !== null;
        });

        \Illuminate\Support\Facades\Gate::define('access-dashboard', function ($user) {
            return $user->isAdmin() || ($user->isAgency() && $user->agency !== null);
        });

        \Illuminate\Support\Facades\Gate::define('verify-tours', function ($user) {
            return $user->isAdmin();
        });

        \Illuminate\Support\Facades\Gate::define('moderate-reviews', function ($user) {
            return $user->isAdmin();
        });

        \Illuminate\Support\Facades\Gate::define('view-activity-logs', function ($user) {
            return $user->isAdmin();
        });

        \Illuminate\Support\Facades\Gate::define('manage-users', function ($user) {
            return $user->isAdmin();
        });

        \Illuminate\Support\Facades\Gate::define('manage-settings', function ($user) {
            return $user->isAdmin();
        });
    }
}