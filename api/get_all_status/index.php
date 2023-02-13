<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

$results = $db->select('SELECT usu.deleted_at, usu.id as usu_id, usu.first_name, usu.last_name, per.id as per_id, per.photo_url FROM users usu
                        LEFT JOIN perfil AS per ON usu.id = per.user_id WHERE usu.deleted_at IS NULL');


$resposta = [];

foreach ($results as $result) {
    
     array_push($resposta, [
        'id' => api_encript::aesEncriptar($result->usu_id),
        'first_name' => $result->first_name,
        'last_name' => $result->last_name,
        'photo_url' => $result->photo_url
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
