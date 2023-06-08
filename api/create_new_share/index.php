<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

// require_once('../inc/database.php');
// require_once('../inc/config.php');

// $db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (
    !isset($variables['comment']) ||
    !isset($variables['user_id']) ||
    !isset($variables['post_id'])
) {
    error_response('Dados insuficientes');
}

$params = [
    ':id' => api_encript::aesDesencriptar($variables['post_id']),
];

$db->update('UPDATE posts SET
modified_at = NOW()
WHERE id = :id', $params);

$params = [
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
    ':post_id' => api_encript::aesDesencriptar($variables['post_id']),
    ':comment' => $variables['comment'],
];

$db->insert('INSERT INTO shares VALUES(
    0, 
    :comment,
    :user_id, 
    :post_id, 
    NOW(),
    NULL)', $params);

sucess_response("Compartilhado com sucesso");

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
