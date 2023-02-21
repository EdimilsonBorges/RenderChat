<?php

// deletar um post fisicamente

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$resultado = api_request('get_all_comments', 'GET', $variables);

header("Content-Type:application/json");
echo json_encode($resultado);
exit;