// src/features/booking/components/BookingMessages.jsx

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Paperclip, X } from 'lucide-react';
import api from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';

const BookingMessages = ({ bookingId }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Marcar como leídos
    markAsRead();
    
    // Polling cada 10 segundos para nuevos mensajes
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}/messages`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await api.post(`/bookings/${bookingId}/messages/mark-all-read`);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await api.post(`/bookings/${bookingId}/messages`, {
        message: newMessage,
      });

      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[600px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900">
          Mensajes con la Agencia
        </h3>
        <p className="text-sm text-gray-600">
          Comunícate directamente sobre tu reserva
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay mensajes aún</p>
            <p className="text-sm text-gray-400 mt-2">
              Inicia la conversación con la agencia
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === user.id;

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    isOwn
                      ? 'bg-primary text-gray-900'
                      : 'bg-gray-100 text-gray-900'
                  } rounded-2xl px-4 py-3`}
                >
                  {/* Nombre del remitente */}
                  {!isOwn && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      {message.sender?.name || 'Agencia'}
                    </p>
                  )}

                  {/* Mensaje */}
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.message}
                  </p>

                  {/* Hora */}
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-gray-700' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.created_at)}
                    {isOwn && message.is_read && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-200">
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Escribe tu mensaje..."
              rows="2"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-6 py-3 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Enviar
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
};

export default BookingMessages;