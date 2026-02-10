<?php

namespace App\Mail;

use App\Models\TutorInvite;
use Illuminate\Mail\Mailable;

class TutorInviteMail extends Mailable
{
    public function __construct(public TutorInvite $invite) {}

    public function build()
    {
        $this->invite->loadMissing(['inviter', 'dependent']);

        $url = config('app.frontend_url')
            . '/invite/accept?token='
            . $this->invite->token;

        return $this->subject('Convite para Tutoria Compartilhada')
            ->view('tutor_invite')
            ->with([
                'inviterName'   => $this->invite->inviter->name,
                'inviterEmail'  => $this->invite->inviter->email,
                'dependentName' => $this->invite->dependent->name,
                'customMessage' => $this->invite->message,
                'url'           => $url,
            ]);
    }
}
