<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = $_GET;

api_request('create_new_messager_chat', 'GET', $variables);
//$resultado = api_request('get_messager_chat', 'GET', $variables);

// header("Content-Type:application/json");
// echo json_encode($resultado);
exit;