<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (
    !isset($variables['id'])
) {
    resposta('O post não foi encontrado');
}

$params = [
    ':id' => api_encript::aesDesencriptar($variables['id']),
];

$results = $db->select('SELECT id FROM posts WHERE id = :id', $params);

if (count($results) == 0) {
    resposta('O post não foi encontrado');
}


$db->delete('DELETE FROM posts WHERE id = :id', $params);

resposta('O post foi eliminado com sucesso!!!');

function resposta($nome)
{
   echo json_encode($nome);
    exit;
}