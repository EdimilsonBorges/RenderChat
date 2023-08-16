<?php

//require_once('../inc/authentication.php');
require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (empty($variables['user_id'])) {
    error_response("Não existe nenhum usuário logado");
}

$param = [
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
];

$results = $db->select(
    "SELECT fri.friends_id, usu.first_name, usu.last_name, perf.photo_url,
    (SELECT COUNT(id) FROM friends WHERE user_id = usu.id) AS qtdFriendsCount, 
    (SELECT COUNT(id) FROM friends WHERE user_id IN (SELECT friends_id FROM friends WHERE user_id = :user_id) AND friends_id = usu.id) AS qtdFriendsComun
    FROM friends fri 
    INNER JOIN users usu ON usu.id = fri.friends_id
    LEFT JOIN perfil perf ON perf.user_id = fri.friends_id
    WHERE fri.user_id = :user_id",
    $param
);


$resposta = [];

foreach ($results as $result) {
    
     array_push($resposta, [
        'friends_id' => api_encript::aesEncriptar($result->friends_id),
        'first_name' => $result->first_name,
        'last_name' => $result->last_name,
        'photo_url' => $result->photo_url,
        'qtdFriendsCount' => $result->qtdFriendsCount,
        'qtdFriendsComun' => $result->qtdFriendsComun,
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
    return;
}

function error_response($mensage, $results = [])
{
    header("Content-Type:application/json");
    echo json_encode(
        [
            'status' => 'ERROR',
            'message' => $mensage,
            'results' => $results,
        ],
    );
    return;
}
