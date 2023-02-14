<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

$variables = $_GET;

$results = $db->select('SELECT usu.deleted_at, usu.id AS usu_id, usu.first_name, usu.last_name, per.id AS per_id, per.photo_url FROM users usu
                        LEFT JOIN perfil AS per ON usu.id = per.user_id
                        WHERE usu.deleted_at IS NULL');
$resposta = [];

foreach ($results as $result) {

    $params = [
        ':id' => $result->usu_id,
        ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
    ];

    $counts = $db->select('SELECT COUNT(ch.id) AS count_nread, ch.messeger AS messeger 
                           FROM chats ch WHERE :id = ch.user_id AND :user_id = ch.to_user_id AND ch.read_at IS NULL', $params);

    array_push($resposta, [
        'id' => api_encript::aesEncriptar($result->usu_id),
        'count_nread' => $counts[0]->count_nread,
        'first_name' => $result->first_name,
        'last_name' => $result->last_name,
        'photo_url' => $result->photo_url,
        'messeger' => $counts[0]->messeger,
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
