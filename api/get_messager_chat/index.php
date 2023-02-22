<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$params = [
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
    ':to_user_id' => api_encript::aesDesencriptar($variables['to_user_id']),
];

$results = $db->select('SELECT * FROM chats WHERE to_user_id = :to_user_id OR user_id = :user_id OR to_user_id = :user_id LIMIT 200 OFFSET 0', $params);

$resposta = [];

foreach ($results as $result) {
    
     array_push($resposta, [
        'id' => api_encript::aesEncriptar($result->id),
        'user_id' => api_encript::aesEncriptar($result->user_id),
        'to_user_id' => api_encript::aesEncriptar($result->to_user_id),
        'messeger' => $result->messeger,
        'created_at' => $result->created_at,
        'deleted_at' => $result->deleted_at
    ]);
}

sucess_response("", $resposta);

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
