<?php

//require_once('../inc/authentication.php');

require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

 $variables = $_GET;

if (
    !isset($variables['from_id'])||
    !isset($variables['user_id'])
) {
    error_response('Os dados do chat estão incompletos');
}

$params = [
    ':from_id' => api_encript::aesDesencriptar($variables['from_id']),
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
];

$db->update('UPDATE chats SET read_at = NOW() WHERE user_id = :from_id AND to_user_id = :user_id', $params);

    sucess_response("Chat editado com sucesso");

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
