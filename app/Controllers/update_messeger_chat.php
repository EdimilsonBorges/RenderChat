<?php

// editar um chat

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = $_GET;

$resultado = api_request('update_messeger_chat', 'GET', $variables);
