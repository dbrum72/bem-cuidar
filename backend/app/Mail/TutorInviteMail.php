<?php

namespace App\Mail;

use App\Models\TutorInvite;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TutorInviteMail extends Mailable {

    use Queueable, SerializesModels;

    public $invite;
    public $inviter;
    public $customMessage;

    public function __construct(TutorInvite $invite, User $inviter, $customMessage = null)  {

        $this->invite = $invite;
        $this->inviter = $inviter;
        $this->customMessage = $customMessage;
    }

    public function build() {
        
        $acceptUrl = config('app.frontend_url') . '/invite/accept?token=' . $this->invite->token;
        // usamos view dedicada
        return $this->subject('Você foi convidado(a) como tutor')
                    ->view('emails.tutor_invite')
                    ->with([
                        'invite' => $this->invite,
                        'inviter' => $this->inviter,
                        'acceptUrl' => $acceptUrl,
                        'customMessage' => $this->customMessage
                    ]);
    }
}
