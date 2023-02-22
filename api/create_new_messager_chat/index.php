<?php

//require_once('../inc/authentication.php');

require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (
    !isset($variables['messeger']) ||
    !isset($variables['user_id']) ||
    !isset($variables['to_user_id'])
) {
    error_response('Os dados do comentário estão incompletos');
}

if(empty($variables['messeger'])){
    error_response("Nada está sendo enviado");
 }

$params = [
    ':messeger' => nl2br($variables['messeger']),
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
    ':to_user_id' => api_encript::aesDesencriptar($variables['to_user_id']),
];


$db->insert('INSERT INTO chats VALUES(
    0, 
    :messeger, 
    NULL,
    :user_id, 
    :to_user_id,
    NOW(),
    NULL)', $params);

sucess_response('Enviado com sucesso!!!');

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
