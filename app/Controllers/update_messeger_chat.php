<?php

// editar um chat

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$resultado = api_request('update_messeger_chat', 'GET', $variables);
