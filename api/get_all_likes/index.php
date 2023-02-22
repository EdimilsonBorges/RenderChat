<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$params = [
    ':post_id'=> api_encript::aesDesencriptar($variables['post_id']),
];

$results = $db->select('SELECT li.*, usu.first_name, usu.last_name, usu.deleted_at, perf.photo_url FROM likes li 
LEFT JOIN users AS usu ON li.user_id = usu.id AND usu.deleted_at IS NULL
LEFT JOIN perfil AS perf ON perf.user_id = li.user_id WHERE li.post_id = :post_id ORDER BY li.created_at DESC LIMIT 200 OFFSET 0', $params);

sucess_response("", $results);

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
