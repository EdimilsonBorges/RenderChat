<?php

require_once('../inc/authentication.php');


$params = $_GET;

$params = [
    ':post_id' => aesDesencriptar($params['post_id']),
];

$results = $db->select("SELECT post_id, COUNT(*) totals FROM likes WHERE post_id = :post_id UNION ALL 
                        SELECT post_id, COUNT(*)  FROM comments WHERE post_id = :post_id UNION ALL 
                        SELECT post_id, COUNT(*)  FROM shares WHERE post_id = :post_id", $params);

echo json_encode(
    [
        'status' => 'SUCESS',
        'message' => '',
        'results' => $results,
    ],
);
exit;

function aesEncriptar($valor)
{

    return bin2hex(openssl_encrypt($valor, "aes-256-cbc", AES_KEY, OPENSSL_RAW_DATA, AES_IV));
}

function aesDesencriptar($valor)
{

    return openssl_decrypt(hex2bin($valor), "aes-256-cbc", AES_KEY, OPENSSL_RAW_DATA, AES_IV);
}
