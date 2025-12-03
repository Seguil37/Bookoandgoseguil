<?php
// app/Models/BookingDocument.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'type',
        'file_name',
        'file_path',
        'file_url',
        'file_size',
        'mime_type',
        'generated_at',
        'download_count',
        'last_downloaded_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'last_downloaded_at' => 'datetime',
        'file_size' => 'integer',
        'download_count' => 'integer',
    ];

    // Relaciones
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    // Accessors
    public function getFileSizeFormattedAttribute()
    {
        $bytes = $this->file_size;
        
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }

    public function getTypeNameAttribute()
    {
        $types = [
            'voucher' => 'Voucher',
            'ticket' => 'Ticket',
            'invoice' => 'Factura',
            'receipt' => 'Recibo',
            'contract' => 'Contrato',
        ];

        return $types[$this->type] ?? $this->type;
    }

    // Scopes
    public function scopeVouchers($query)
    {
        return $query->where('type', 'voucher');
    }

    public function scopeInvoices($query)
    {
        return $query->where('type', 'invoice');
    }
}