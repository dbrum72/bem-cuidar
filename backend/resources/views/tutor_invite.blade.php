<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Convite para ser tutor</title>
</head>
<body>
    <p>Olá,</p>

    <p>O usuário <strong>{{ $inviter->name }}</strong> ({{ $inviter->email }}) convidou você para ser tutor na plataforma.</p>

    @if(!empty($customMessage))
        <p>Mensagem:</p>
        <blockquote>{{ $customMessage }}</blockquote>
    @endif

    <p>Para aceitar o convite, clique no link abaixo:</p>
    <p><a href="{{ $acceptUrl }}">{{ $acceptUrl }}</a></p>

    <p>Se preferir, copie e cole o link em seu navegador.</p>

    <p>Se você não esperava esse e-mail, desconsidere.</p>

    <p>Atenciosamente,<br/>Equipe</p>
</body>
</html>
