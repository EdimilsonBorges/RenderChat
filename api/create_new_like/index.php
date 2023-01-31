<?php

require_once('../inc/authentication.php');

// require_once('../inc/database.php');
// require_once('../inc/config.php');

// $db = new database();

$variables = $_GET;

if (
    !isset($variables['user_id']) ||
    !isset($variables['post_id'])
) {
   // echo "Dados insuficientes";
    exit;
}

$params = [
    ':user_id' => aesDesencriptar($variables['user_id']),
    ':post_id' => aesDesencriptar($variables['post_id']),
];


$results = $db->select('SELECT id FROM likes WHERE user_id = :user_id AND post_id = :post_id', $params);

if (count($results) != 0) {
    
    $db->delete('DELETE FROM likes WHERE id = :id', [':id' => $results['0']->id]);
    resposta("Curtir");
}


$db->insert('INSERT INTO likes VALUES(
    0, 
    :user_id, 
    :post_id, 
    NOW(),
    NULL)', $params);

$params = [
    ':post_id' => $variables['post_id'],
];

$db->update('UPDATE posts SET
modified_at = NOW()
WHERE id = :post_id', $params);

resposta("Descurtir");

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
