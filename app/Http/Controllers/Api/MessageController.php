<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * Listar mensajes de una reserva
     */
    public function index(Request $request, $bookingId)
    {
        $booking = Booking::findOrFail($bookingId);
        $user = $request->user();

        // Verificar permisos
        if ($booking->user_id !== $user->id && 
            (!$user->isAgency() || $booking->agency_id !== $user->agency->id) &&
            !$user->isAdmin()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $messages = Message::forBooking($bookingId)
            ->with(['sender:id,name,avatar', 'receiver:id,name,avatar'])
            ->latest()
            ->paginate(50);

        // Marcar mensajes no leídos del usuario actual como leídos
        Message::forBooking($bookingId)
            ->where('receiver_id', $user->id)
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return response()->json($messages);
    }

    /**
     * Enviar mensaje
     */
    public function store(Request $request, $bookingId)
    {
        $booking = Booking::findOrFail($bookingId);
        $user = $request->user();

        // Verificar permisos
        if ($booking->user_id !== $user->id && 
            (!$user->isAgency() || $booking->agency_id !== $user->agency->id) &&
            !$user->isAdmin()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|max:10240', // 10MB
        ]);

        // Determinar receptor
        $receiverId = $user->id === $booking->user_id 
            ? $booking->tour->agency->user_id 
            : $booking->user_id;

        // Procesar archivos adjuntos
        $attachmentUrls = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store("messages/booking-{$bookingId}", 'public');
                $attachmentUrls[] = [
                    'url' => Storage::disk('public')->url($path),
                    'name' => $file->getClientOriginalName(),
                    'type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ];
            }
        }

        $message = Message::create([
            'booking_id' => $bookingId,
            'sender_id' => $user->id,
            'receiver_id' => $receiverId,
            'message' => $validated['message'],
            'attachments' => empty($attachmentUrls) ? null : $attachmentUrls,
        ]);

        // TODO: Enviar notificación al receptor

        return response()->json([
            'message' => 'Mensaje enviado exitosamente',
            'data' => $message->load('sender', 'receiver')
        ], 201);
    }

    /**
     * Obtener conversaciones del usuario
     */
    public function conversations(Request $request)
    {
        $user = $request->user();

        // Obtener bookings con mensajes
        $bookings = Booking::whereHas('messages', function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                ->orWhere('receiver_id', $user->id);
        })
        ->with([
            'tour:id,title,featured_image',
            'messages' => function ($query) use ($user) {
                $query->latest()->limit(1);
            }
        ])
        ->get();

        $conversations = $bookings->map(function ($booking) use ($user) {
            $lastMessage = $booking->messages->first();
            $unreadCount = Message::forBooking($booking->id)
                ->where('receiver_id', $user->id)
                ->unread()
                ->count();

            // Determinar el otro participante
            $otherParticipant = $user->id === $booking->user_id
                ? $booking->tour->agency->user
                : $booking->user;

            return [
                'booking_id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'tour_title' => $booking->tour->title,
                'tour_image' => $booking->tour->featured_image,
                'other_participant' => [
                    'id' => $otherParticipant->id,
                    'name' => $otherParticipant->name,
                    'avatar' => $otherParticipant->avatar,
                ],
                'last_message' => [
                    'content' => $lastMessage->message,
                    'created_at' => $lastMessage->created_at,
                    'is_sender' => $lastMessage->sender_id === $user->id,
                ],
                'unread_count' => $unreadCount,
            ];
        });

        return response()->json([
            'conversations' => $conversations
        ]);
    }

    /**
     * Marcar todos los mensajes como leídos
     */
    public function markAllAsRead(Request $request, $bookingId)
    {
        $user = $request->user();

        Message::forBooking($bookingId)
            ->where('receiver_id', $user->id)
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return response()->json([
            'message' => 'Mensajes marcados como leídos'
        ]);
    }

    /**
     * Obtener contador de mensajes no leídos
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        $count = Message::where('receiver_id', $user->id)
            ->unread()
            ->count();

        return response()->json([
            'unread_count' => $count
        ]);
    }

    /**
     * Eliminar mensaje
     */
    public function destroy($bookingId, $messageId)
    {
        $message = Message::forBooking($bookingId)->findOrFail($messageId);
        $user = request()->user();

        // Solo el remitente puede eliminar
        if ($message->sender_id !== $user->id) {
            return response()->json([
                'message' => 'No puedes eliminar este mensaje'
            ], 403);
        }

        // Eliminar archivos adjuntos
        if ($message->hasAttachments()) {
            foreach ($message->attachments as $attachment) {
                $path = parse_url($attachment['url'], PHP_URL_PATH);
                $path = str_replace('/storage/', '', $path);
                Storage::disk('public')->delete($path);
            }
        }

        $message->delete();

        return response()->json([
            'message' => 'Mensaje eliminado exitosamente'
        ]);
    }
}