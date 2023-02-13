<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = $_GET;

$params = [
    ':post_id'=> api_encript::aesDesencriptar($variables['post_id']),
];

$results = $db->select('SELECT co.*, perf.photo_url AS co_photo_url, usu.first_name AS co_first_name, usu.last_name AS co_last_name FROM comments co
INNER JOIN users AS usu ON usu.id = co.user_id
LEFT JOIN perfil AS perf ON perf.user_id = usu.id
WHERE co.post_id = :post_id ORDER BY co.created_at DESC LIMIT 200 OFFSET 0', $params);

$resposta = [];

foreach ($results as $result) {
    
     array_push($resposta, [
        'id' => api_encript::aesEncriptar($result->id),
        'user_id' => api_encript::aesEncriptar($result->user_id),
        'comment' => $result->comment,
        'co_first_name' => $result->co_first_name,
        'co_last_name' => $result->co_last_name,
        'co_photo_url' => $result->co_photo_url
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
