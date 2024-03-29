<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (
    !isset($variables['post']) ||
    !isset($variables['foto_url']) ||
    !isset($variables['video_url']) ||
    !isset($variables['user_id'])
) {
    error_response('Os dados do cadastro estão incompletos');
}

// if(empty($variables['post']) && empty($variables['foto_url']) && empty($variables['video_url'])){
//     error_response("Nada está sendo postado");
//  }

// $params = [
//     ':post' => nl2br($variables['post']),
//     ':foto_url' => $variables['foto_url'],
//     ':video_url' => $variables['video_url'],
//     ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
// ];


// $db->insert('INSERT INTO posts VALUES(
//     0, 
//     :post, 
//     :foto_url, 
//     :video_url,
//     :user_id, 
//     NOW(),
//     NOW(),
//     NULL)', $params);

$params = [
    ':post' => nl2br($variables['post']),
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
];

$db->insert('INSERT INTO posts (post, user_id, created_at, modified_at, deleted_at) VALUES (
    :post, 
    :user_id, 
    NOW(),
    NOW(),
    NULL)', $params);

sucess_response('Postado com sucesso!!!');

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
