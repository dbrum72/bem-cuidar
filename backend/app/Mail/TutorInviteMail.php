<?php

// app/Mail/TutorInviteMail.php
namespace App\Mail;

use App\Models\TutorInvite;
use Illuminate\Mail\Mailable;

class TutorInviteMail extends Mailable {

    public function __construct(public TutorInvite $invite) {}

    public function build() {

        $url = config(env('APP_URL'))
             . '/tutor-invite/accept?token='
             . $this->invite->token;

        return $this->subject('Convite para Tutoria Compartilhada')
            ->view('tutor_invite')
            ->with([
                'inviter' => $this->invite->inviter,
                'url'     => $url
            ]);
    }
}
