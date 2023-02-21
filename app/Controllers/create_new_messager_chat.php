<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

api_request('create_new_messager_chat', 'GET', $variables);
exit;