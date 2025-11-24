<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Tour extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'agency_id', 'category_id', 'title', 'slug', 'description',
        'itinerary', 'includes', 'excludes', 'requirements',
        'cancellation_policy', 'refund_policy', 'cancellation_hours',
        'price', 'discount_price', 'duration_days', 'duration_hours',
        'max_people', 'min_people', 'difficulty_level',
        'location_city', 'location_region', 'location_country',
        'latitude', 'longitude', 'featured_image',
        'rating', 'total_reviews', 'total_bookings',
        'is_featured', 'is_active', 
        'is_published', 'published_at', 'creation_step',
        'admin_verified', 'admin_verified_at',
        'quality_checklist',
        'available_from', 'available_to',
        'available_days',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'rating' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'available_from' => 'datetime',
        'available_to' => 'datetime',
        'available_days' => 'array',
        'quality_checklist' => 'array',
        'cancellation_policy' => 'string',
        
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($tour) {
            if (empty($tour->slug)) {
                $tour->slug = Str::slug($tour->title);
            }
        });
    }

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(TourImage::class)->orderBy('order');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByLocation($query, $city = null, $region = null)
    {
        return $query->when($city, function ($q) use ($city) {
            $q->where('location_city', 'like', "%{$city}%");
        })->when($region, function ($q) use ($region) {
            $q->where('location_region', 'like', "%{$region}%");
        });
    }

    public function scopePriceRange($query, $min = null, $max = null)
    {
        return $query->when($min, function ($q) use ($min) {
            $q->where('price', '>=', $min);
        })->when($max, function ($q) use ($max) {
            $q->where('price', '<=', $max);
        });
    }

    public function getCurrentPrice()
    {
        return $this->discount_price ?? $this->price;
    }

    public function hasDiscount(): bool
    {
        return !is_null($this->discount_price) && $this->discount_price < $this->price;
    }

    public function getDiscountPercentage(): int
    {
        if (!$this->hasDiscount()) return 0;
        return round((($this->price - $this->discount_price) / $this->price) * 100);
    }

    public function updateRating()
    {
        $this->rating = $this->reviews()->avg('rating') ?? 0;
        $this->total_reviews = $this->reviews()->count();
        $this->save();
    }
}
