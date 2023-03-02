<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$params = [
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
];

$results = $db->select('SELECT usu.id AS usu_id, usu.first_name, usu.last_name, per.id AS per_id, per.photo_url,

IFNULL(
        (SELECT ch.messeger FROM chats ch WHERE usu.id = ch.user_id AND :user_id = ch.to_user_id AND ch.read_at IS NULL ORDER BY ch.created_at DESC LIMIT 1 ),
        (SELECT ch.messeger FROM chats ch WHERE :user_id = ch.user_id AND usu.id = ch.to_user_id ORDER BY ch.created_at DESC LIMIT 1 )
    ) AS messeger,

(SELECT ch.to_user_id FROM chats ch WHERE usu.id = ch.user_id AND :user_id = ch.to_user_id AND ch.read_at IS NULL LIMIT 1 ) AS to_user_id,
(SELECT COUNT(ch.id) FROM chats ch WHERE usu.id = ch.user_id AND :user_id = ch.to_user_id AND ch.read_at IS NULL) AS count_nread

FROM users usu
LEFT JOIN perfil AS per ON usu.id = per.user_id WHERE usu.deleted_at IS NULL', $params);
$resposta = [];

foreach ($results as $result) {

    array_push($resposta, [
        'id' => api_encript::aesEncriptar($result->usu_id),
        'to_user_id' => api_encript::aesEncriptar($result->to_user_id),
        'count_nread' => $result->count_nread,
        'first_name' => $result->first_name,
        'last_name' => $result->last_name,
        'photo_url' => $result->photo_url,
        'messeger' => $result->messeger,
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
}
