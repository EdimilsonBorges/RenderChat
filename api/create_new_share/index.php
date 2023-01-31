<?php

require_once('../inc/authentication.php');

// require_once('../inc/database.php');
// require_once('../inc/config.php');

// $db = new database();

$variables = $_GET;

if (
    !isset($variables['comment']) ||
    !isset($variables['user_id']) ||
    !isset($variables['post_id'])
) {
   // echo "Dados insuficientes";
    exit;
}

$params = [
    ':id' => $variables['post_id'],
];

$db->update('UPDATE posts SET
modified_at = NOW()
WHERE id = :id', $params);

$params = [
    ':user_id' => aesDesencriptar($variables['user_id']),
    ':post_id' => aesDesencriptar($variables['post_id']),
    ':comment' => $variables['comment'],
];

$db->insert('INSERT INTO shares VALUES(
    0, 
    :comment,
    :user_id, 
    :post_id, 
    NOW(),
    NULL)', $params);


resposta("Compartilhado com sucesso");

function aesEncriptar($valor)
{

    return bin2hex(openssl_encrypt($valor, "aes-256-cbc", AES_KEY, OPENSSL_RAW_DATA, AES_IV));
}

function aesDesencriptar($valor)
{

    return openssl_decrypt(hex2bin($valor), "aes-256-cbc", AES_KEY, OPENSSL_RAW_DATA, AES_IV);
}

function resposta($nome)
{
   echo json_encode($nome);
    exit;
}
