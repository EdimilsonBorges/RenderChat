<?php

// totals chat

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = $_GET;

$resultado = api_request('totals_chat_nread', 'GET', $variables);

header("Content-Type:application/json");
echo json_encode($resultado);
exit;