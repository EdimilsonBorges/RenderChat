<?php

//require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');
require_once('../inc/database.php');
require_once('../inc/config.php');

 $db = new database();

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


$db->insert('INSERT INTO friends VALUES(
    0, 
    :user_id, 
    :friends_id, 
    NOW(),
    NULL)', $params);

$db->insert('INSERT INTO friends VALUES(
    0, 
    :friends_id, 
    :user_id, 
    NOW(),
    NULL)', $params);

$db->delete('DELETE FROM friendrequests WHERE user_id = :friends_id AND friends_id = :user_id', $params);

sucess_response("Convite enviado com sucesso");

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
