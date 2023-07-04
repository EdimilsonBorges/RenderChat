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
    "SELECT  
    CASE 
        WHEN fri.user_id = :user_id THEN usu.id ELSE fri.user_id 
    END AS friends_id,
    CASE 
        WHEN usu.id = :user_id THEN us.first_name ELSE usu.first_name 
    END AS first_name,
    CASE 
        WHEN usu.id = :user_id THEN us.last_name ELSE usu.last_name 
    END AS last_name,
    CASE 
        WHEN fri.user_id = :user_id THEN per.photo_url ELSE pe.photo_url 
    END AS photo_url FROM friends fri
    INNER JOIN users usu ON usu.id = fri.friends_id 
    INNER JOIN users us ON us.id = fri.user_id
    LEFT JOIN perfil per ON per.user_id = fri.friends_id 
    LEFT JOIN perfil pe ON pe.user_id = fri.user_id WHERE fri.user_id = :user_id OR usu.id = :user_id",
    $param
);


$resposta = [];

foreach ($results as $result) {
    
     array_push($resposta, [
        'friends_id' => api_encript::aesEncriptar($result->friends_id),
        'first_name' => $result->first_name,
        'last_name' => $result->last_name,
        'photo_url' => $result->photo_url,
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
