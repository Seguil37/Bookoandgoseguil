<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voucher - {{ $booking->booking_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .voucher-title {
            font-size: 24px;
            color: #1e293b;
            margin-bottom: 10px;
        }
        .booking-number {
            font-size: 18px;
            color: #64748b;
            background: #f1f5f9;
            padding: 10px 20px;
            display: inline-block;
            border-radius: 5px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 15px;
            text-transform: uppercase;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 5px;
        }
        .info-grid {
            display: table;
            width: 100%;
        }
        .info-row {
            display: table-row;
        }
        .info-label {
            display: table-cell;
            padding: 10px;
            font-weight: bold;
            color: #64748b;
            width: 40%;
            background: #f8fafc;
        }
        .info-value {
            display: table-cell;
            padding: 10px;
            color: #1e293b;
        }
        .tour-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .tour-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
        }
        .pricing {
            background: #ecfdf5;
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 20px;
        }
        .pricing-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        .pricing-row.total {
            border-top: 2px solid #10b981;
            margin-top: 10px;
            padding-top: 15px;
            font-size: 18px;
            font-weight: bold;
            color: #047857;
        }
        .important-info {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin-top: 30px;
        }
        .important-info h4 {
            color: #92400e;
            margin-bottom: 10px;
        }
        .important-info ul {
            list-style: none;
            padding-left: 0;
        }
        .important-info li {
            padding: 5px 0;
            color: #78350f;
        }
        .important-info li:before {
            content: "• ";
            color: #f59e0b;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
        }
        .qr-code {
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">BOOK&GO</div>
            <div class="voucher-title">Comprobante de Reserva</div>
            <div class="booking-number">{{ $booking->booking_number }}</div>
        </div>

        <!-- Tour Details -->
        <div class="section">
            <div class="section-title">Detalles del Tour</div>
            <div class="tour-details">
                <div class="tour-title">{{ $booking->tour->title }}</div>
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Operador:</div>
                        <div class="info-value">{{ $booking->tour->agency->business_name }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Ubicación:</div>
                        <div class="info-value">{{ $booking->tour->location_city }}, {{ $booking->tour->location_region }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Duración:</div>
                        <div class="info-value">{{ $booking->tour->duration_days }} día(s) {{ $booking->tour->duration_hours > 0 ? '- ' . $booking->tour->duration_hours . ' hora(s)' : '' }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Booking Information -->
        <div class="section">
            <div class="section-title">Información de Reserva</div>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Fecha del Tour:</div>
                    <div class="info-value">{{ $booking->booking_date->format('d/m/Y') }}</div>
                </div>
                @if($booking->booking_time)
                <div class="info-row">
                    <div class="info-label">Hora:</div>
                    <div class="info-value">{{ $booking->booking_time }}</div>
                </div>
                @endif
                <div class="info-row">
                    <div class="info-label">Número de Personas:</div>
                    <div class="info-value">{{ $booking->number_of_people }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Estado:</div>
                    <div class="info-value">
                        <strong style="color: {{ $booking->status === 'confirmed' ? '#10b981' : '#f59e0b' }}">
                            {{ strtoupper($booking->status) }}
                        </strong>
                    </div>
                </div>
            </div>
        </div>

        <!-- Customer Information -->
        <div class="section">
            <div class="section-title">Datos del Cliente</div>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Nombre:</div>
                    <div class="info-value">{{ $booking->customer_name }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value">{{ $booking->customer_email }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Teléfono:</div>
                    <div class="info-value">{{ $booking->customer_phone }}</div>
                </div>
            </div>
        </div>

        <!-- Pricing -->
        <div class="section">
            <div class="section-title">Detalle de Pago</div>
            <div class="pricing">
                <div class="pricing-row">
                    <span>Precio por persona:</span>
                    <span>S/ {{ number_format($booking->price_per_person, 2) }}</span>
                </div>
                <div class="pricing-row">
                    <span>Cantidad de personas:</span>
                    <span>{{ $booking->number_of_people }}</span>
                </div>
                <div class="pricing-row">
                    <span>Subtotal:</span>
                    <span>S/ {{ number_format($booking->subtotal, 2) }}</span>
                </div>
                @if($booking->discount > 0)
                <div class="pricing-row">
                    <span>Descuento:</span>
                    <span>- S/ {{ number_format($booking->discount, 2) }}</span>
                </div>
                @endif
                <div class="pricing-row">
                    <span>IGV (18%):</span>
                    <span>S/ {{ number_format($booking->tax, 2) }}</span>
                </div>
                <div class="pricing-row total">
                    <span>TOTAL:</span>
                    <span>S/ {{ number_format($booking->total_price, 2) }}</span>
                </div>
            </div>
        </div>

        <!-- Important Information -->
        <div class="important-info">
            <h4>Información Importante</h4>
            <ul>
                <li>Presenta este voucher el día del tour (impreso o digital)</li>
                <li>Llega 15 minutos antes de la hora programada</li>
                <li>Trae tu documento de identidad</li>
                @if($booking->tour->requirements)
                <li>{{ $booking->tour->requirements }}</li>
                @endif
                <li>Política de cancelación: {{ $booking->tour->cancellation_hours }} horas antes</li>
            </ul>
        </div>

        <!-- Contact Info -->
        <div class="section" style="margin-top: 30px;">
            <div class="section-title">Contacto del Operador</div>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Agencia:</div>
                    <div class="info-value">{{ $booking->tour->agency->business_name }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Teléfono:</div>
                    <div class="info-value">{{ $booking->tour->agency->phone }}</div>
                </div>
                @if($booking->tour->agency->email)
                <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value">{{ $booking->tour->agency->user->email }}</div>
                </div>
                @endif
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Este es un documento generado electrónicamente por Book&Go</p>
            <p>Generado el: {{ now()->format('d/m/Y H:i') }}</p>
            <p>www.bookandgo.com | soporte@bookandgo.com | +51 999 999 999</p>
        </div>
    </div>
</body>
</html>