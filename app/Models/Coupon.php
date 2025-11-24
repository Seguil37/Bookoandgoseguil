<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'type',
        'value',
        'min_purchase',
        'max_uses',
        'used_count',
        'valid_from',
        'valid_until',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_purchase' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'is_active' => 'boolean',
    ];

    // ===== RELACIONES =====

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // ===== SCOPES =====

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeValid($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('valid_from')
                    ->orWhere('valid_from', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('valid_until')
                    ->orWhere('valid_until', '>=', now());
            });
    }

    public function scopeAvailable($query)
    {
        return $query->valid()
            ->where(function ($q) {
                $q->whereNull('max_uses')
                    ->orWhereRaw('used_count < max_uses');
            });
    }

    // ===== MÉTODOS =====

    /**
     * Verificar si el cupón es válido
     */
    public function isValid()
    {
        if (!$this->is_active) {
            return false;
        }

        // Verificar fechas
        if ($this->valid_from && now()->lt($this->valid_from)) {
            return false;
        }

        if ($this->valid_until && now()->gt($this->valid_until)) {
            return false;
        }

        // Verificar usos
        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Calcular descuento para un monto
     */
    public function calculateDiscount($amount)
    {
        if ($this->type === 'percentage') {
            return ($amount * $this->value) / 100;
        }
        
        return min($this->value, $amount); // No puede ser mayor que el monto
    }

    /**
     * Aplicar cupón a un monto
     */
    public function applyToAmount($amount)
    {
        // Verificar compra mínima
        if ($this->min_purchase && $amount < $this->min_purchase) {
            throw new \Exception("El monto mínimo para usar este cupón es S/{$this->min_purchase}");
        }

        $discount = $this->calculateDiscount($amount);
        $finalAmount = max(0, $amount - $discount);

        return [
            'original_amount' => $amount,
            'discount' => $discount,
            'final_amount' => $finalAmount,
            'discount_percentage' => ($discount / $amount) * 100,
        ];
    }

    /**
     * Incrementar contador de usos
     */
    public function incrementUsage()
    {
        $this->increment('used_count');
    }

    /**
     * Verificar si puede ser usado
     */
    public function canBeUsed($amount = null)
    {
        if (!$this->isValid()) {
            return false;
        }

        // Verificar monto mínimo si se proporciona
        if ($amount && $this->min_purchase && $amount < $this->min_purchase) {
            return false;
        }

        return true;
    }

    /**
     * Obtener razón de invalidez
     */
    public function getInvalidReason()
    {
        if (!$this->is_active) {
            return 'El cupón está inactivo';
        }

        if ($this->valid_from && now()->lt($this->valid_from)) {
            return 'El cupón aún no es válido';
        }

        if ($this->valid_until && now()->gt($this->valid_until)) {
            return 'El cupón ha expirado';
        }

        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return 'El cupón ha alcanzado su límite de usos';
        }

        return null;
    }

    // ===== ACCESSORS =====

    /**
     * Formatear valor del cupón
     */
    public function getFormattedValueAttribute()
    {
        if ($this->type === 'percentage') {
            return $this->value . '%';
        }
        
        return 'S/' . number_format($this->value, 2);
    }

    /**
     * Obtener usos restantes
     */
    public function getRemainingUsesAttribute()
    {
        if (!$this->max_uses) {
            return null; // Ilimitado
        }

        return max(0, $this->max_uses - $this->used_count);
    }

    /**
     * Verificar si está cerca de expirar
     */
    public function getIsExpiringAttribute()
    {
        if (!$this->valid_until) {
            return false;
        }

        return now()->diffInDays($this->valid_until) <= 7;
    }
}