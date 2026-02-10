<?php

namespace App\Http\Controllers;

use App\Models\Dependent;
use App\Models\TutorInvite;
use App\Models\User;
use App\Mail\TutorInviteMail;
use App\Http\Requests\TutorInviteCreateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TutorInviteController extends Controller {
    
    public function __construct() {

        $this->middleware('jwt.auth', ['except' => ['accept']]);
    }

    /************************************************************************************/
    public function index(Request $request) {

        $user = auth()->user();

        $invites = TutorInvite::where('inviter_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['invites' => $invites], 200);
    }

    /************************************************************************************/
    public function store(TutorInviteCreateRequest $request)  {

        $user = auth()->user();

        $existingUser = User::where('email', $request->tutor_email)->first();

        if ($existingUser && $existingUser->id === $user->id) {
            return response()->json(['message' => 'Você não pode convidar a si mesmo.'], 422);
        }

        $dependent = Dependent::findOrFail($request->dependent_id);

        DB::beginTransaction();
        
        try {
            $invite = TutorInvite::create([
            'inviter_id'   => $user->id,
            'dependent_id' => $request->dependent_id,
            'tutor_id'     => $existingUser?->id,
            'tutor_email'  => $request->tutor_email,
            'message'      => $request->message,
            'token'        => Str::random(64),
        ]);

        $invite->load(['inviter', 'dependent']);

        Mail::to($invite->tutor_email)
            ->send(new TutorInviteMail($invite));
            DB::commit();

            return response()->json([
                'message' => 'Convite enviado com sucesso.',
                'invite' => $invite
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao criar convite: '.$e->getMessage());
            return response()->json(['message' => 'Erro ao enviar convite: '.$e->getMessage()], 500);
        }
    }

    /************************************************************************************/
    public function accept($token) {

        $invite = TutorInvite::where('token', $token)->first();

        if (!$invite) {
            return redirect(env('APP_FRONTEND_URL') . '/invite/invalid?reason=not_found');
        }

        if ($invite->status !== 'pendente') {
            return redirect(env('APP_FRONTEND_URL') . '/invite/invalid?reason=already_processed');
        }

        DB::beginTransaction();
        try {
            $invite->status = 'aceito';
            $invite->aceito_at = now();
            $invite->save();

            // Cria vínculo entre tutor e dependente (ou usuário principal)
            DB::table('dependent_tutor')->insertOrIgnore([
                'dependent_id' => $invite->dependent_id,
                'tutor_id' => $invite->tutor_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            return redirect(env('APP_FRONTEND_URL') . '/invite/aceito?token=' . $invite->token);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao aceitar convite: '.$e->getMessage());
            return redirect(env('APP_FRONTEND_URL') . '/invite/error');
        }
    }
    
    /************************************************************************************/
    public function resend(TutorInvite $invite) {

        abort_if($invite->status !== 'pendente', 422);

        Mail::to($invite->tutor_email)
            ->send(new TutorInviteMail($invite));

        return response()->noContent();
    }

    /************************************************************************************/
    public function destroy(TutorInvite $invite) {

        abort_if($invite->status !== 'pendente', 422);

        $invite->update(['status' => 'cancelado']);

        return response()->noContent();
    }
}
