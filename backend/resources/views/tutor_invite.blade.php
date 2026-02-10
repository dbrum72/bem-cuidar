<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <title>Convite para Tutoria Compartilhada</title>
</head>
<body>

<p>Olá,</p>

<p>
    O usuário
    <strong>{{ $inviterName }}</strong>
    ({{ $inviterEmail }})
    convidou você para ser tutor de
    <strong>{{ $dependentName }}</strong>
    na plataforma <strong>ConVIVA</strong>.
</p>

@if(!empty($customMessage))
    <p><strong>Mensagem:</strong></p>
    <blockquote>
        {{ $customMessage }}
    </blockquote>
@endif

<p>Para aceitar o convite, clique no link abaixo:</p>

<p>
    <a href="{{ $url }}">{{ $url }}</a>
</p>

<p>
    Caso ainda não possua cadastro, você será direcionado para criá-lo.
</p>

<p>
    Se você não esperava este e-mail, pode desconsiderá-lo.
</p>

<p>
    Atenciosamente,<br>
    Equipe ConVIVA
</p>

</body>
</html>
