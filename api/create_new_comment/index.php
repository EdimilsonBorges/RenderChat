<?php

//require_once('../inc/authentication.php');

require_once('../inc/database.php');
require_once('../inc/config.php');

$db = new database();

 $variables = $_GET;

if (
    !isset($variables['comment']) ||
    !isset($variables['user_id']) ||
    !isset($variables['post_id'])
) {
    error_response('Os dados do comentário estão incompletos');
}

if(empty($variables['comment'])){
    error_response("Nada está sendo comentado");
 }


//date_default_timezone_set('America/Los_Angeles');

//date("Y-m-d h:i:sa");

//$agora = new DateTime();

$params = [
    ':comment' => nl2br($variables['comment']),
    ':user_id' => aesDesencriptar($variables['user_id']),
    ':post_id' => aesDesencriptar($variables['post_id']),
];


$db->insert('INSERT INTO comments VALUES(
    0, 
    :comment, 
    :user_id, 
    :post_id, 
    NOW(),
    NOW(),
    NULL)', $params);

sucess_response('Comentado com sucesso!!!');

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
