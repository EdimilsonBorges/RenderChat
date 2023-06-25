<?php

require_once('../inc/authentication.php');

 $variables = $_GET;

if (
    !isset($variables['first_name']) ||
    !isset($variables['last_name']) ||
    !isset($variables['email']) ||
    !isset($variables['pass']) ||
    !isset($variables['date_nasc']) ||
    !isset($variables['genre'])
) {
    error_response('Os dados do cadastro estão incompletos');
}


$params = [
    ':email' => $variables['email'],
];

$results = $db->select('SELECT email FROM users WHERE email = :email', $params);

if (count($results) != 0) {
    error_response('Já existe um usuário com o mesmo e-mail');
}

$params = [
    ':first_name' => $variables['first_name'],
    ':last_name' => $variables['last_name'],
    ':email' => $variables['email'],
    ':pass' => $variables['pass'],
    ':date_nasc' => $variables['date_nasc'],
    ':genre' => $variables['genre'],
];


$db->insert('INSERT INTO users VALUES(
    0, 
    :first_name, 
    :last_name, 
    :email,
    :pass, 
    :date_nasc, 
    :genre,
    NOW(),
    NOW(),
    NULL,
    NULL)', $params);

sucess_response('Cadastro completado com sucesso!!!');

function error_response($mensage)
{
    header("Content-Type:application/json");
    echo json_encode(
        [
            'status' => 'ERROR',
            'message' => $mensage,
            'results' => [],
        ],
    );
    exit;
}

function sucess_response($mensage, $results = [])
{
    header("Content-Type:application/json");
    echo json_encode(
        [
            'status' => 'SUCESS',
            'message' => $mensage,
            'results' => $results,
        ],
    );
    exit;
}
