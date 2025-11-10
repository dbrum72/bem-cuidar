<?php

namespace App\Http\Controllers;

use App\Models\TutorInvite;
use App\Models\User;
use App\Mail\TutorInviteMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class TutorInviteController extends Controller {
    
    public function __construct() {

        $this->middleware('jwt.auth', ['except' => ['accept']]);
    }

    public function index(Request $request) {

        $user = auth()->user();

        $invites = TutorInvite::where('inviter_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['invites' => $invites], 200);
    }

    public function store(Request $request)  {

        $user = auth()->user();

        $data = $request->validate([
            'tutor_email' => 'required|email',
            'message' => 'nullable|string|max:1000'
        ]);

        $tutor = User::where('email', $data['tutor_email'])->first();

        if (!$tutor) {
            return response()->json(['message' => 'Usuário (tutor) com esse e-mail não foi encontrado.'], 404);
        }

        if ($tutor->id === $user->id) {
            return response()->json(['message' => 'Você não pode convidar a si mesmo.'], 422);
        }

        $existing = TutorInvite::where('inviter_id', $user->id)
            ->where('tutor_id', $tutor->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Já existe um convite pendente para esse tutor.'], 409);
        }

        DB::beginTransaction();
        try {
            $invite = TutorInvite::create([
                'inviter_id' => $user->id,
                'tutor_id' => $tutor->id,
                'tutor_email' => $tutor->email,
            ]);

            Mail::to($tutor->email)->send(new TutorInviteMail($invite, $user, $data['message'] ?? null));

            DB::commit();

            return response()->json([
                'message' => 'Convite enviado com sucesso.',
                'invite' => $invite
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao criar convite: '.$e->getMessage());
            return response()->json(['message' => 'Erro ao enviar convite.'], 500);
        }
    }

    public function accept($token) {

        $invite = TutorInvite::where('token', $token)->first();

        if (!$invite) {
            return redirect(config('app.frontend_url') . '/invite/invalid?reason=not_found');
        }

        if ($invite->status !== 'pending') {
            return redirect(config('app.frontend_url') . '/invite/invalid?reason=already_processed');
        }

        DB::beginTransaction();
        try {
            $invite->status = 'accepted';
            $invite->accepted_at = now();
            $invite->save();

            // Cria vínculo entre tutor e dependente (ou usuário principal)
            DB::table('dependent_tutor')->insertOrIgnore([
                'dependent_id' => $invite->inviter_id,
                'tutor_id' => $invite->tutor_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            return redirect(config('app.frontend_url') . '/invite/accepted?token=' . $invite->token);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao aceitar convite: '.$e->getMessage());
            return redirect(config('app.frontend_url') . '/invite/error');
        }
    }

    
    public function resend(Request $request, $id) {

        $user = auth()->user();

        $invite = TutorInvite::where('id', $id)->where('inviter_id', $user->id)->first();

        if (!$invite) {
            return response()->json(['message' => 'Convite não encontrado.'], 404);
        }

        if ($invite->status !== 'pending') {
            return response()->json(['message' => 'Apenas convites pendentes podem ser reenviados.'], 422);
        }

        try {
            Mail::to($invite->tutor_email)->send(new TutorInviteMail($invite, $user));
            return response()->json(['message' => 'Convite reenviado com sucesso.'], 200);
        } catch (\Exception $e) {
            \Log::error('Erro ao reenviar convite: '.$e->getMessage());
            return response()->json(['message' => 'Erro ao reenviar convite.'], 500);
        }
    }

    
    public function destroy(Request $request, $id) {

        $user = auth()->user();

        $invite = TutorInvite::where('id', $id)
            ->where('inviter_id', $user->id)
            ->first();

        if (!$invite) {
            return response()->json(['message' => 'Convite não encontrado.'], 404);
        }

        if ($invite->status === 'accepted') {
            return response()->json(['message' => 'Convites já aceitos não podem ser excluídos.'], 422);
        }

        try {
            $invite->delete();
            return response()->json(['message' => 'Convite removido com sucesso.'], 200);
        } catch (\Exception $e) {
            \Log::error('Erro ao excluir convite: '.$e->getMessage());
            return response()->json(['message' => 'Erro ao excluir convite.'], 500);
        }
    }
}
