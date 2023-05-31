<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

// require_once('../inc/database.php');
// require_once('../inc/config.php');

// $db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (
    !isset($variables['user_id']) ||
    !isset($variables['post_id'])
) {
   // echo "Dados insuficientes";
    exit;
}

$params = [
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
    ':post_id' => api_encript::aesDesencriptar($variables['post_id']),
];


$results = $db->select('SELECT id FROM likes WHERE user_id = :user_id AND post_id = :post_id', $params);

if (count($results) != 0) {
    
    $db->delete('DELETE FROM likes WHERE id = :id', [':id' => $results['0']->id]);
    sucess_response("", "Curtir");
}


$db->insert('INSERT INTO likes VALUES(
    0, 
    :user_id, 
    :post_id, 
    NOW(),
    NULL)', $params);

$params = [
    ':post_id' => api_encript::aesDesencriptar($variables['post_id']),
];

$db->update('UPDATE posts SET
modified_at = NOW()
WHERE id = :post_id', $params);

sucess_response("", "Descurtir");

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
