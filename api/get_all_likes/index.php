<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$params = [
    ':post_id'=> api_encript::aesDesencriptar($variables['post_id']),
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
];

$results = $db->select('SELECT li.*, usu.first_name, usu.last_name, usu.deleted_at AS usu_deleted_at, perf.photo_url, (SELECT COUNT(id) FROM friends WHERE user_id = :user_id AND friends_id = usu.id) AS friend, (SELECT COUNT(id) FROM friendrequests WHERE user_id = :user_id && friends_id = usu.id OR user_id = usu.id && friends_id = :user_id) AS friendrequest FROM likes li LEFT JOIN users AS usu ON li.user_id = usu.id LEFT JOIN perfil AS perf ON perf.user_id = li.user_id WHERE li.post_id = :post_id ORDER BY li.created_at DESC LIMIT 200 OFFSET 0;', $params);

$resposta = [];

foreach ($results as $result) {
    
     array_push($resposta, [
        'id' => $result->id,
        'user_id' => api_encript::aesEncriptar($result->user_id),
        'post_id' => api_encript::aesEncriptar($result->post_id),
        'first_name' => $result->first_name,
        'last_name' => $result->last_name,
        'photo_url' => $result->photo_url,
        'friend' => $result->friend,
        'friendrequest' => $result->friendrequest,
        'deleted_at' => $result->deleted_at,
        'created_at' => $result->created_at,
        'usu_deleted_at' => $result->usu_deleted_at,
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
