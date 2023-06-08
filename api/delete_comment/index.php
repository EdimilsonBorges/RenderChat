<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (
    !isset($variables['id'])
) {
    resposta('O post não foi encontrado');
}

$params = [
    ':id' => api_encript::aesDesencriptar($variables['id']),
];

$results = $db->select('SELECT id FROM comments WHERE id = :id', $params);

if (count($results) == 0) {
    error_response('O post não foi encontrado');
}


$db->delete('DELETE FROM comments WHERE id = :id', $params);

sucess_response('O post foi eliminado com sucesso!!!');


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