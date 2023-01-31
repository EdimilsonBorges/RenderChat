<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');

$db = new database();

$variables = $_GET;

$params = [
    ':post_id'=> aesDesencriptar($variables['post_id']),
];

$results = $db->select('SELECT li.*, usu.first_name, usu.last_name, usu.deleted_at, perf.photo_url FROM likes li 
LEFT JOIN users AS usu ON li.user_id = usu.id AND usu.deleted_at IS NULL
LEFT JOIN perfil AS perf ON perf.user_id = li.user_id WHERE li.post_id = :post_id ORDER BY li.created_at DESC LIMIT 200 OFFSET 0', $params);

sucess_response("", $results);

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
