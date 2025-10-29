<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller {    

    public function register(Request $request) {
        $data = $request->validate([
            'name'=>'required|string',
            'email'=>'required|email|unique:users',
            'password'=>'required|string|min:6'
        ]);

        $user = User::create([
            'name'=>$data['name'],
            'email'=>$data['email'],
            'password'=>Hash::make($data['password'])
        ]);

        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json(['user'=>$user,'token'=>$token],201);
    }

    public function login(Request $request) {
        $data = $request->validate([
            'email'=>'required|email',
            'password'=>'required'
        ]);

        $user = User::where('email',$data['email'])->first();

        if(!$user || !Hash::check($data['password'],$user->password)){
            return response()->json(['message'=>'Credenciais inválidas'],401);
        }

        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json(['user'=>$user,'token'=>$token]);
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'Logout realizado']);
    }

}
