<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$params = [
    ':id' => api_encript::aesDesencriptar($variables['id']),
];

$results = $db->select('SELECT usu.first_name, usu.last_name, per.photo_url, per.capa_url, per.city_natal_id, per.city_mora_id FROM users usu
LEFT JOIN perfil per ON per.user_id = usu.id 
WHERE usu.id = :id', $params);

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
