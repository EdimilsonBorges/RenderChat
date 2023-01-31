<?php

// deletar um post fisicamente

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = $_GET;

$resultado = api_request('get_all_status');

header("Content-Type:application/json");
echo json_encode($resultado);
exit;