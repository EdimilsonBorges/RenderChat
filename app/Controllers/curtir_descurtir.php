<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$variables = [
      'user_id' => $variables['user_id'],
      'post_id' => $variables['post_id'],
    ];

$curtir = api_request('create_new_like', 'GET', $variables);

echo '</pre>';
print_r($curtir);
exit;
