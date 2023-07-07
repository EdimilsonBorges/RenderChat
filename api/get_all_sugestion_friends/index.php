<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$params = [
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
];

$results = $db->select('SELECT usu.id, usu.first_name, usu.last_name, perf.photo_url FROM users usu
LEFT JOIN perfil perf ON perf.user_id = usu.id
WHERE usu.id != :user_id', $params);
$resposta = [];

foreach ($results as $result) {

    array_push($resposta, [
        'friends_id' => api_encript::aesEncriptar($result->id),
        'first_name' => $result->first_name,
        'last_name' => $result->last_name,
        'photo_url' => $result->photo_url,
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
