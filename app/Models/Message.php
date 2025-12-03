<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'sender_id',
        'receiver_id',
        'message',
        'attachments',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'attachments' => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    // ===== RELACIONES =====

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    // ===== SCOPES =====

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    public function scopeBetweenUsers($query, $userId1, $userId2)
    {
        return $query->where(function ($q) use ($userId1, $userId2) {
            $q->where('sender_id', $userId1)->where('receiver_id', $userId2);
        })->orWhere(function ($q) use ($userId1, $userId2) {
            $q->where('sender_id', $userId2)->where('receiver_id', $userId1);
        });
    }

    public function scopeForBooking($query, $bookingId)
    {
        return $query->where('booking_id', $bookingId);
    }

    // ===== MÉTODOS =====

    /**
     * Marcar mensaje como leído
     */
    public function markAsRead()
    {
        if (!$this->is_read) {
            $this->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }
    }

    /**
     * Verificar si tiene archivos adjuntos
     */
    public function hasAttachments()
    {
        return !empty($this->attachments);
    }

    /**
     * Obtener cantidad de adjuntos
     */
    public function getAttachmentsCountAttribute()
    {
        return $this->hasAttachments() ? count($this->attachments) : 0;
    }

    /**
     * Verificar si el usuario es el remitente
     */
    public function isSender($userId)
    {
        return $this->sender_id == $userId;
    }

    /**
     * Verificar si el usuario es el receptor
     */
    public function isReceiver($userId)
    {
        return $this->receiver_id == $userId;
    }

    /**
     * Obtener el otro participante de la conversación
     */
    public function getOtherParticipant($userId)
    {
        return $this->sender_id == $userId ? $this->receiver : $this->sender;
    }

    // ===== ACCESSORS =====

    /**
     * Formatear fecha de creación
     */
    public function getFormattedDateAttribute()
    {
        return $this->created_at->diffForHumans();
    }
}