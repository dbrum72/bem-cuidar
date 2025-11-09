<?php

namespace App\Mail;

use App\Models\Dependent;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TutorInviteMail extends Mailable {

    use Queueable, SerializesModels;

    public $dependent;
    public $token;
    public $expiresAt;

    public function __construct(Dependent $dependent, string $token, $expiresAt) {

        $this->dependent = $dependent;
        $this->token = $token;
        $this->expiresAt = $expiresAt;
    }

    public function build() {
        
        $acceptUrl = url("/tutor/accept/{$this->token}");

        return $this->subject('Convite para ser tutor de ' . $this->dependent->name)
                    ->view('emails.tutor_invite')
                    ->with([
                        'dependent' => $this->dependent,
                        'acceptUrl' => $acceptUrl,
                        'expiresAt' => $this->expiresAt->format('d/m/Y H:i'),
                    ]);
    }
}
