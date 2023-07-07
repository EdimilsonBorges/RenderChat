<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (
    !isset($variables['user_id']) ||
    !isset($variables['friends_id'])
) {
    echo "Dados insuficientes";
    exit;
}

$params = [
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
    ':friends_id' => api_encript::aesDesencriptar($variables['friends_id']),
];

$db->delete('DELETE FROM friendrequests WHERE user_id = :friends_id AND friends_id = :user_id', $params);

sucess_response('A solicitação foi eliminado com sucesso!!!');


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