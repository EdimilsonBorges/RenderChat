<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$params = [
    ':post_id' => api_encript::aesDesencriptar($variables['post_id']),
];

$results = $db->select('SELECT pos.id, pos.post FROM posts pos WHERE pos.id = :post_id', $params);

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
