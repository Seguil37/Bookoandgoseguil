<?php
// app/Http/Controllers/Api/BookingDocumentController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class BookingDocumentController extends Controller
{
    // Listar documentos de una reserva
    public function index($bookingId)
    {
        $user = request()->user();
        $booking = Booking::findOrFail($bookingId);

        // Verificar permisos
        if ($booking->user_id !== $user->id && 
            (!$user->isAgency() || $booking->agency_id !== $user->agency->id)) {
            return response()->json([
                'message' => 'No tienes permiso'
            ], 403);
        }

        $documents = $booking->documents;

        return response()->json([
            'success' => true,
            'data' => $documents
        ]);
    }

    // Generar voucher
    public function generateVoucher($bookingId)
    {
        $booking = Booking::with(['tour', 'user', 'agency'])->findOrFail($bookingId);
        $user = request()->user();

        // Verificar permisos
        if ($booking->user_id !== $user->id) {
            return response()->json([
                'message' => 'No tienes permiso'
            ], 403);
        }

        // Verificar si ya existe
        $existingVoucher = $booking->documents()
            ->where('type', 'voucher')
            ->first();

        if ($existingVoucher) {
            return response()->json([
                'success' => true,
                'message' => 'Voucher ya existe',
                'data' => $existingVoucher
            ]);
        }

        // Generar PDF
        $pdf = Pdf::loadView('documents.voucher', compact('booking'));
        $fileName = "voucher_{$booking->booking_number}.pdf";
        $filePath = "documents/vouchers/{$fileName}";
        
        Storage::disk('public')->put($filePath, $pdf->output());

        // Crear registro
        $document = BookingDocument::create([
            'booking_id' => $booking->id,
            'type' => 'voucher',
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_url' => Storage::url($filePath),
            'file_size' => Storage::size('public/' . $filePath),
            'mime_type' => 'application/pdf',
            'generated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Voucher generado exitosamente',
            'data' => $document
        ], 201);
    }

    // Generar factura
    public function generateInvoice(Request $request, $bookingId)
    {
        $booking = Booking::with(['tour', 'user', 'agency'])->findOrFail($bookingId);

        $validated = $request->validate([
            'ruc' => 'required|string|size:11',
            'business_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        // Generar PDF
        $pdf = Pdf::loadView('documents.invoice', [
            'booking' => $booking,
            'invoice_data' => $validated
        ]);

        $fileName = "invoice_{$booking->booking_number}.pdf";
        $filePath = "documents/invoices/{$fileName}";
        
        Storage::disk('public')->put($filePath, $pdf->output());

        // Crear registro
        $document = BookingDocument::create([
            'booking_id' => $booking->id,
            'type' => 'invoice',
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_url' => Storage::url($filePath),
            'file_size' => Storage::size('public/' . $filePath),
            'mime_type' => 'application/pdf',
            'generated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Factura generada exitosamente',
            'data' => $document
        ], 201);
    }

    // Descargar documento
    public function download($bookingId, $documentId)
    {
        $document = BookingDocument::where('booking_id', $bookingId)
            ->findOrFail($documentId);

        // Incrementar contador
        $document->increment('download_count');
        $document->update(['last_downloaded_at' => now()]);

        return Storage::download('public/' . $document->file_path, $document->file_name);
    }

    // Eliminar documento
    public function destroy($bookingId, $documentId)
    {
        $document = BookingDocument::where('booking_id', $bookingId)
            ->findOrFail($documentId);

        // Eliminar archivo
        Storage::disk('public')->delete($document->file_path);

        // Eliminar registro
        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Documento eliminado exitosamente'
        ]);
    }
}