<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');

$db = new database();

$variables = $_GET;

$params = [
    ':email' => $variables['email'],
];

$results = $db->select('SELECT usu.id, usu.first_name, usu.last_name, usu.email, usu.pass, perf.photo_url FROM users usu
LEFT JOIN perfil AS perf ON usu.id = perf.user_id 
WHERE email = :email', $params);

if (count($results) == 0) {
    error_response("Login Inválido");
}


$results = [
    'id' => aesEncriptar($results[0]->id),
    'first_name' => $results[0]->first_name,
    'last_name' => $results[0]->last_name,
    'email' => $results[0]->email,
    'pass' => $results[0]->pass,
    'photo_url' => $results[0]->photo_url,
];


if (!password_verify($variables['pass'], $results['pass'])) {
    error_response("Login Inválido");
}



sucess_response("", $results);


function aesEncriptar($valor){

    return bin2hex(openssl_encrypt($valor, "aes-256-cbc", AES_KEY, OPENSSL_RAW_DATA, AES_IV));
}

function aesDesencriptar($valor){

    return openssl_decrypt(hex2bin($valor), "aes-256-cbc", AES_KEY, OPENSSL_RAW_DATA, AES_IV);
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

function error_response($mensage, $results = [])
{
    header("Content-Type:application/json");
    echo json_encode(
        [
            'status' => 'ERROR',
            'message' => $mensage,
            'results' => $results,
        ],
    );
    exit;
}
