<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

// require_once('../inc/database.php');
// require_once('../inc/config.php');

// $db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (
    !isset($variables['comment']) ||
    !isset($variables['user_id']) ||
    !isset($variables['post_id'])
) {
   // echo "Dados insuficientes";
    exit;
}

$params = [
    ':id' => $variables['post_id'],
];

$db->update('UPDATE posts SET
modified_at = NOW()
WHERE id = :id', $params);

$params = [
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
    ':post_id' => api_encript::aesDesencriptar($variables['post_id']),
    ':comment' => $variables['comment'],
];

$db->insert('INSERT INTO shares VALUES(
    0, 
    :comment,
    :user_id, 
    :post_id, 
    NOW(),
    NULL)', $params);


resposta("Compartilhado com sucesso");

function resposta($nome)
{
   echo json_encode($nome);
    exit;
}
