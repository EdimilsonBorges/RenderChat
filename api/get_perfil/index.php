<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$params = [
    ':id' => api_encript::aesDesencriptar($variables['id']),
    ':user_id'=> api_encript::aesDesencriptar($variables['user_id']),
];

$results = $db->select('SELECT usu.first_name, usu.last_name, per.photo_url, per.capa_url, per.city_natal_id, per.city_mora_id, 
(SELECT COUNT(id) FROM friends WHERE user_id = :id) AS qtdFriend, 
(SELECT COUNT(id) FROM friends WHERE user_id IN (SELECT friends_id FROM friends WHERE user_id = :user_id) AND friends_id = :id AND :user_id != :id) AS qtdFriendComun,
(SELECT COUNT(id) FROM friends WHERE user_id = :user_id AND friends_id = :id) AS friend, 
(SELECT COUNT(id) FROM friendrequests WHERE user_id = :user_id AND friends_id = :id) AS friendrequestEnv, 
(SELECT COUNT(id) FROM friendrequests WHERE user_id = :id AND friends_id = :user_id) AS friendrequestReceb 
FROM users usu
LEFT JOIN perfil per ON per.user_id = usu.id 
WHERE usu.id = :id', $params);

if (count($results) == 0) {
    error_response('Nenhum usuario encontrado');
}

sucess_response("", $results);

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
