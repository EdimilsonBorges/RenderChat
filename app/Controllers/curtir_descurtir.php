<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');


$variables = $_GET;

$variables = [
      'users_id' => $variables['user_id'],
      'post_id' => $variables['post_id'],
    ];

$curtir = api_request('create_new_like', 'GET', $_GET);

echo '</pre>';
print_r($curtir);
exit;
