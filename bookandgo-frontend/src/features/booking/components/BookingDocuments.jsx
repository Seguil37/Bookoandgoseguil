// src/features/booking/components/BookingDocuments.jsx

import { useState } from 'react';
import { bookingDocumentsApi } from '@/shared/utils/api';
import { Download, FileText, Clock } from 'lucide-react';

export const BookingDocuments = ({ bookingId }) => {
    const [downloading, setDownloading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchDocuments();
    }, [bookingId]);
    
    const fetchDocuments = async () => {
        try {
            const response = await bookingDocumentsApi.list(bookingId);
            setDocuments(response.data.documents);
        } catch (error) {
            console.error('Error al cargar documentos:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownloadVoucher = async () => {
        setDownloading(true);
        try {
            await bookingDocumentsApi.downloadVoucher(bookingId);
            toast.success('Voucher descargado exitosamente');
            fetchDocuments(); // Actualizar lista
        } catch (error) {
            toast.error('Error al descargar voucher');
        } finally {
            setDownloading(false);
        }
    };
    
    const handleDownloadDocument = async (documentId) => {
        try {
            const response = await api.get(
                `/bookings/${bookingId}/documents/${documentId}/download`,
                { responseType: 'blob' }
            );
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document-${documentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success('Documento descargado');
        } catch (error) {
            toast.error('Error al descargar documento');
        }
    };
    
    return (
        <div className="booking-documents">
            <h3>Documentos de Reserva</h3>
            
            {/* Botón principal para generar voucher */}
            <button
                onClick={handleDownloadVoucher}
                disabled={downloading}
                className="btn-primary"
            >
                {downloading ? (
                    <>
                        <Clock className="animate-spin" />
                        Generando...
                    </>
                ) : (
                    <>
                        <Download />
                        Descargar Voucher
                    </>
                )}
            </button>
            
            {/* Lista de documentos existentes */}
            {loading ? (
                <p>Cargando documentos...</p>
            ) : documents.length > 0 ? (
                <div className="documents-list">
                    {documents.map((doc) => (
                        <div key={doc.id} className="document-item">
                            <FileText />
                            <div className="doc-info">
                                <p className="doc-name">{doc.file_name}</p>
                                <p className="doc-meta">
                                    {doc.formatted_size} · 
                                    Descargado {doc.download_count} veces
                                </p>
                            </div>
                            <button
                                onClick={() => handleDownloadDocument(doc.id)}
                                className="btn-icon"
                            >
                                <Download />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-documents">
                    No hay documentos generados aún
                </p>
            )}
        </div>
    );
};