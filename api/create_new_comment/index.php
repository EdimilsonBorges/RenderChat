<?php

//require_once('../inc/authentication.php');

require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

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

$params = [
    ':comment' => nl2br($variables['comment']),
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
    ':post_id' => api_encript::aesDesencriptar($variables['post_id']),
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
