<?php

//require_once('../inc/authentication.php');

require_once('../inc/database.php');
require_once('../inc/config.php');

$db = new database();

 $variables = $_GET;

if (
    !isset($variables['messeger']) ||
    !isset($variables['user_id']) ||
    !isset($variables['to_user_id'])
) {
    error_response('Os dados do comentário estão incompletos');
}

if(empty($variables['messeger'])){
    error_response("Nada está sendo enviado");
 }


//date_default_timezone_set('America/Los_Angeles');

//date("Y-m-d h:i:sa");

//$agora = new DateTime();

$params = [
    ':messeger' => nl2br($variables['messeger']),
    ':user_id' => aesDesencriptar($variables['user_id']),
    ':to_user_id' => aesDesencriptar($variables['to_user_id']),
];


$db->insert('INSERT INTO chats VALUES(
    0, 
    :messeger, 
    :user_id, 
    :to_user_id,
    NOW(),
    NULL)', $params);

sucess_response('Enviado com sucesso!!!');

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

function aesEncriptar($valor)
{

    return bin2hex(openssl_encrypt($valor, "aes-256-cbc", AES_KEY, OPENSSL_RAW_DATA, AES_IV));
}

function aesDesencriptar($valor)
{

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
