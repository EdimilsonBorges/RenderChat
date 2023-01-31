<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');

$db = new database();

$variables = $_GET;

$params = [
    ':user_id' => aesDesencriptar($variables['user_id']),
    ':to_user_id' => aesDesencriptar($variables['to_user_id']),
];

$results = $db->select('SELECT * FROM chats WHERE to_user_id = :to_user_id OR user_id = :user_id OR to_user_id = :user_id LIMIT 200 OFFSET 0', $params);

$resposta = [];

foreach ($results as $result) {
    
     array_push($resposta, [
        'id' => aesEncriptar($result->id),
        'user_id' => aesEncriptar($result->user_id),
        'to_user_id' => aesEncriptar($result->to_user_id),
        'messeger' => $result->messeger,
        'created_at' => $result->created_at,
        'deleted_at' => $result->deleted_at
    ]);
}

sucess_response("", $resposta);


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
