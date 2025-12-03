<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Agency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        \Log::info('Register attempt:', $request->all());

        // Validación base
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:customer,agency',
            'phone' => 'required|string|max:20',
        ];

        // Validación adicional para agencias
        if ($request->role === 'agency') {
            $rules = array_merge($rules, [
                'business_name' => 'required|string|max:255',
                'ruc_tax_id' => 'required|string|max:11|unique:agencies',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:100',
                'description' => 'nullable|string|max:1000',
                'website' => 'nullable|url|max:255',
            ]);
        }

        $validated = $request->validate($rules);

        DB::beginTransaction();

        try {
            // Crear usuario
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'phone' => $validated['phone'],
                'city' => $validated['city'] ?? null,
            ]);

            // Si es agencia, crear el perfil de agencia
            if ($validated['role'] === 'agency') {
                $agency = Agency::create([
                    'user_id' => $user->id,
                    'business_name' => $validated['business_name'],
                    'ruc_tax_id' => $validated['ruc_tax_id'],
                    'description' => $validated['description'] ?? 'Agencia de viajes',
                    'phone' => $validated['phone'],
                    'website' => $validated['website'] ?? null,
                    'address' => $validated['address'],
                    'city' => $validated['city'],
                    'country' => 'Peru',
                    'is_verified' => false, // Las agencias deben ser verificadas por admin
                ]);

                // Cargar la relación de agencia
                $user->load('agency');
            }

            $token = $user->createToken('auth-token')->plainTextToken;

            DB::commit();

            return response()->json([
                'message' => $validated['role'] === 'agency'
                    ? 'Agencia registrada exitosamente. Tu cuenta está en revisión.'
                    : 'Usuario registrado exitosamente',
                'user' => $user,
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error en registro:', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Error al registrar usuario',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Tu cuenta está desactivada. Contacta al soporte.'
            ], 403);
        }

        // Eliminar tokens anteriores (opcional)
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => $user->load('agency'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('agency')
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:500',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'avatar' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Perfil actualizado exitosamente',
            'user' => $user->load('agency')
        ]);
    }
}
