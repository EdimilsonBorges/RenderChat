<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$result = api_request('create_new_messager_chat', 'GET', $variables);

header("Content-Type:application/json");
echo json_encode($result);
exit;