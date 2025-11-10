<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AuthController extends Controller {

    public function __construct() {

        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function login(Request $request)  {

        $credentials = $request->only(['email', 'password']);

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function me() {
        $user = Auth::guard('api')->user();
        if (!$user) return response()->json(null, 401);

        $roles = $user->getRoleNames(); // collection
        $permissions = $user->getAllPermissions()->pluck('name');

        return response()->json([
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function logout() {

        Auth::guard('api')->logout();
        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }

    public function refresh() {

        try {
            $newToken = Auth::guard('api')->refresh();
            return $this->respondWithToken($newToken);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Não foi possível renovar o token.'], 401);
        }
    }

    protected function respondWithToken($token) {

        $user = Auth::guard('api')->user();
        $roles = $user->getRoleNames();
        $permissions = $user->getAllPermissions()->pluck('name');

        return response()->json([
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'msg' => 'Login realizado com sucesso.'
        ]);
    }
}