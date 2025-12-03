<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Listar cupones (Admin)
     */
    public function index(Request $request)
    {
        $query = Coupon::with('creator:id,name');

        // Filtros
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('valid')) {
            $query->valid();
        }

        $coupons = $query->latest()->paginate(15);

        return response()->json($coupons);
    }

    /**
     * Crear cupón (Admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code|max:50',
            'description' => 'nullable|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'is_active' => 'boolean',
        ]);

        // Validar valor de porcentaje
        if ($validated['type'] === 'percentage' && $validated['value'] > 100) {
            return response()->json([
                'message' => 'El porcentaje no puede ser mayor a 100'
            ], 422);
        }

        $validated['code'] = strtoupper($validated['code']);
        $validated['created_by'] = $request->user()->id;

        $coupon = Coupon::create($validated);

        return response()->json([
            'message' => 'Cupón creado exitosamente',
            'coupon' => $coupon
        ], 201);
    }

    /**
     * Ver detalle de cupón
     */
    public function show($id)
    {
        $coupon = Coupon::with('creator:id,name')->findOrFail($id);

        return response()->json($coupon);
    }

    /**
     * Actualizar cupón (Admin)
     */
    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);

        $validated = $request->validate([
            'description' => 'sometimes|string|max:255',
            'value' => 'sometimes|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'valid_from' => 'sometimes|date',
            'valid_until' => 'sometimes|date|after:valid_from',
            'is_active' => 'boolean',
        ]);

        // Validar valor de porcentaje
        if (isset($validated['value']) && $coupon->type === 'percentage' && $validated['value'] > 100) {
            return response()->json([
                'message' => 'El porcentaje no puede ser mayor a 100'
            ], 422);
        }

        $coupon->update($validated);

        return response()->json([
            'message' => 'Cupón actualizado exitosamente',
            'coupon' => $coupon
        ]);
    }

    /**
     * Eliminar cupón (Admin)
     */
    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);

        // Verificar si tiene usos
        if ($coupon->used_count > 0) {
            return response()->json([
                'message' => 'No se puede eliminar un cupón que ya ha sido usado'
            ], 422);
        }

        $coupon->delete();

        return response()->json([
            'message' => 'Cupón eliminado exitosamente'
        ]);
    }

    /**
     * Validar cupón (Público - para clientes)
     */
    public function validate(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', strtoupper($validated['code']))->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Cupón no encontrado'
            ], 404);
        }

        if (!$coupon->canBeUsed($validated['amount'])) {
            return response()->json([
                'valid' => false,
                'message' => $coupon->getInvalidReason()
            ], 422);
        }

        $result = $coupon->applyToAmount($validated['amount']);

        return response()->json([
            'valid' => true,
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'description' => $coupon->description,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'formatted_value' => $coupon->formatted_value,
            ],
            'calculation' => $result
        ]);
    }

    /**
     * Aplicar cupón (al crear reserva)
     */
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $coupon = Coupon::where('code', strtoupper($validated['code']))->first();

        if (!$coupon) {
            return response()->json([
                'message' => 'Cupón no encontrado'
            ], 404);
        }

        if (!$coupon->isValid()) {
            return response()->json([
                'message' => $coupon->getInvalidReason()
            ], 422);
        }

        // Incrementar uso
        $coupon->incrementUsage();

        return response()->json([
            'message' => 'Cupón aplicado exitosamente',
            'coupon' => $coupon
        ]);
    }

    /**
     * Activar/Desactivar cupón
     */
    public function toggleStatus($id)
    {
        $coupon = Coupon::findOrFail($id);
        
        $coupon->update([
            'is_active' => !$coupon->is_active
        ]);

        return response()->json([
            'message' => $coupon->is_active ? 'Cupón activado' : 'Cupón desactivado',
            'coupon' => $coupon
        ]);
    }

    /**
     * Estadísticas de cupones (Admin)
     */
    public function statistics()
    {
        $stats = [
            'total' => Coupon::count(),
            'active' => Coupon::active()->count(),
            'valid' => Coupon::valid()->count(),
            'expired' => Coupon::active()
                ->where('valid_until', '<', now())
                ->count(),
            'by_type' => [
                'percentage' => Coupon::where('type', 'percentage')->count(),
                'fixed' => Coupon::where('type', 'fixed')->count(),
            ],
            'most_used' => Coupon::orderBy('used_count', 'desc')
                ->limit(5)
                ->get(['id', 'code', 'used_count', 'max_uses']),
        ];

        return response()->json($stats);
    }
}