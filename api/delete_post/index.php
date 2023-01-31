<?php

require_once('../inc/authentication.php');

 $variables = $_GET;

if (
    !isset($variables['id'])
) {
    resposta('O post não foi encontrado');
}

$params = [
    ':id' => aesDesencriptar($variables['id']),
];

$results = $db->select('SELECT id FROM posts WHERE id = :id', $params);

if (count($results) == 0) {
    resposta('O post não foi encontrado');
}


$db->delete('DELETE FROM posts WHERE id = :id', $params);

resposta('O post foi eliminado com sucesso!!!');

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