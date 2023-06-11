<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (
    !isset($variables['post']) ||
    !isset($variables['post_id']) ||
    !isset($variables['user_id']) ||
    !isset($variables['post_user_id']) ||
    !isset($variables['foto_url']) ||
    !isset($variables['video_url'])
) {
 error_response("Dados do post incompleto");
}

if(empty($variables['post']) && empty($variables['foto_url']) && empty($variables['video_url'])){
    error_response("Nada está sendo publicado");
 }

 if($variables['user_id'] == $variables['post_user_id']){

    $params = [
        ':post_id' => api_encript::aesDesencriptar($variables['post_id']),
        ':post' => nl2br($variables['post']),
        ':foto_url' => $variables['foto_url'],
        ':video_url' => $variables['video_url'],
    ];

    $db->update('UPDATE posts SET
        post = :post, 
        foto_url = :foto_url, 
        video_url = :video_url,
        modified_at = NOW()
        WHERE id = :post_id', $params);

        sucess_response("Post editado com sucesso");
}

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
