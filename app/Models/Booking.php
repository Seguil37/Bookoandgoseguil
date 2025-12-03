<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_number',
        'user_id',
        'tour_id',
        'agency_id',
        'booking_date',
        'booking_time',
        'number_of_people',
        'price_per_person',
        'subtotal',
        'discount',
        'tax',
        'total_price',
        'customer_name',
        'customer_email',
        'customer_phone',
        'special_requirements',
        'status',
        'confirmed_at',
        'cancelled_at',
        'cancellation_reason',
        'coupon_id', // NUEVO
    ];

    protected $casts = [
        'booking_date' => 'date',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    // ===== RELACIONES EXISTENTES =====

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    // ===== NUEVAS RELACIONES =====

    /**
     * Documentos asociados a la reserva (vouchers, facturas, etc.)
     */
    public function documents()
    {
        return $this->hasMany(BookingDocument::class);
    }

    /**
     * Mensajes de la conversación de esta reserva
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Cupón aplicado a la reserva
     */
    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    // ===== SCOPES EXISTENTES =====

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('booking_date', '>=', now())
            ->whereIn('status', ['pending', 'confirmed']);
    }

    public function scopePast($query)
    {
        return $query->where('booking_date', '<', now());
    }

    // ===== MÉTODOS EXISTENTES =====

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isConfirmed()
    {
        return $this->status === 'confirmed';
    }

    public function canBeCancelled()
    {
        return in_array($this->status, ['pending', 'confirmed']) 
            && $this->booking_date->isFuture();
    }

    public function canBeReviewed()
    {
        return $this->status === 'completed' 
            && !$this->review;
    }

    public function generateBookingNumber()
    {
        return 'BG-' . strtoupper(uniqid());
    }

    // ===== NUEVOS MÉTODOS =====

    /**
     * Verificar si tiene documentos generados
     */
    public function hasDocuments()
    {
        return $this->documents()->exists();
    }

    /**
     * Obtener voucher de la reserva
     */
    public function getVoucher()
    {
        return $this->documents()->where('type', 'voucher')->first();
    }

    /**
     * Verificar si tiene mensajes no leídos para un usuario
     */
    public function hasUnreadMessagesFor($userId)
    {
        return $this->messages()
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->exists();
    }

    /**
     * Contar mensajes no leídos para un usuario
     */
    public function getUnreadMessagesCountFor($userId)
    {
        return $this->messages()
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->count();
    }

    /**
     * Verificar si tiene cupón aplicado
     */
    public function hasCoupon()
    {
        return !is_null($this->coupon_id);
    }

    // ===== EVENTOS =====

    protected static function boot()
    {
        parent::boot();

        // Generar número de reserva al crear
        static::creating(function ($booking) {
            if (empty($booking->booking_number)) {
                $booking->booking_number = $booking->generateBookingNumber();
            }
        });
    }
}