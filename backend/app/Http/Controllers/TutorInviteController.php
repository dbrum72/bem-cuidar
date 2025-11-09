<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Dependent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TutorInviteController extends Controller {
    
    // Envia convite
    public function sendInvite(Request $request, $dependentId) {

        $data = $request->validate([
            'email' => 'required|email',
            'relationship_type' => 'nullable|string|max:50',
        ]);

        $dependent = Dependent::findOrFail($dependentId);

        // Busca ou cria o usuário tutor
        $tutor = User::firstOrCreate(
            ['email' => $data['email']],
            [
                'name' => $request->input('name', 'Tutor convidado'),
                'password' => bcrypt(Str::random(10)),
            ]
        );

        // Gera token e data de expiração (48h)
        $token = Str::uuid();
        $expiresAt = Carbon::now()->addHours(48);

        // Vincula tutor com status "pending"
        $dependent->tutors()->syncWithoutDetaching([
            $tutor->id => [
                'relationship_type' => $data['relationship_type'],
                'status' => 'pending',
                'invite_token' => $token,
                'expires_at' => $expiresAt,
            ]
        ]);

        // Envia e-mail
        Mail::to($tutor->email)->send(new \App\Mail\TutorInviteMail($dependent, $token, $expiresAt));

        return response()->json(['message' => 'Convite enviado com sucesso.']);
    }

    // Tutor aceita convite
    public function acceptInvite($token) {

        $pivot = DB::table('dependent_tutor')->where('invite_token', $token)->first();

        if (!$pivot) {
            return response()->json(['message' => 'Convite inválido.'], 404);
        }

        if (Carbon::parse($pivot->expires_at)->isPast()) {
            return response()->json(['message' => 'Este convite expirou.'], 410);
        }

        DB::table('dependent_tutor')->where('id', $pivot->id)->update([
            'status' => 'accepted',
            'invite_token' => null,
            'expires_at' => null,
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Convite aceito com sucesso!']);
    }

    // Lista tutores vinculados (com status)
    public function listTutors($dependentId) {
        
        $dependent = Dependent::with('tutors')->findOrFail($dependentId);

        return response()->json($dependent->tutors);
    }
}
