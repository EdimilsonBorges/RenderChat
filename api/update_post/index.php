<?php

require_once('../inc/authentication.php');

 $variables = $_GET;

if (
    !isset($variables['id']) ||
    !isset($variables['post']) ||
    !isset($variables['user_id']) ||
    !isset($variables['foto_url']) ||
    !isset($variables['video_url'])
) {
 error_response("Dados do post incompleto");
}

if(empty($variables['post']) && empty($variables['foto_url']) && empty($variables['video_url'])){
    error_response("Nada está sendo publicado");
 }


$params = [
    ':id' => aesDesencriptar($variables['id']),
    ':post' => nl2br($variables['post']),
    ':foto_url' => $variables['foto_url'],
    ':video_url' => $variables['video_url'],
];

$db->update('UPDATE posts SET
    post = :post, 
    foto_url = :foto_url, 
    video_url = :video_url,
    modified_at = NOW()
    WHERE id = :id', $params);

    sucess_response("Post editado com sucesso");

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
