<?php

// deletar um comentário fisicamente

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = $_GET;

api_request('delete_comment', 'GET', $variables);
$resultado = api_request('get_all_comments', 'GET', $variables);

header("Content-Type:application/json");
echo json_encode($resultado);
exit;