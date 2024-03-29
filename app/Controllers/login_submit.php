<?php
defined("ROOT") or die("Acesso negado");

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    die('Acesso inválido');
}

$usuario = filter_input(INPUT_POST, "e-mail", FILTER_SANITIZE_EMAIL);
$senha = filter_input(INPUT_POST, "senha", FILTER_DEFAULT);

if (empty($usuario) || empty($senha)) {
    $_SESSION['error'] = 'Dados de login insuficientes';
    header('Location: /RenderChat/app');
    return;
}

$variables = [
    'email' => $usuario,
    'pass' => $senha,
];

$resultado = api_request('login', 'GET', $variables);

if ($resultado['status'] == null || $resultado['status'] == 'ERROR') {
    if($resultado['status'] != null){
        $_SESSION['error'] = $resultado['message'];
    }

    header('Location: /RenderChat/app');
    return;
}

$_SESSION["user_id"] = $resultado['results']['id'];
$_SESSION["first_name"] = $resultado['results']['first_name'];
$_SESSION["last_name"] = $resultado['results']['last_name'];
$_SESSION["photo_url"] = $resultado['results']['photo_url'];

header('Location: /RenderChat/app');
return;
