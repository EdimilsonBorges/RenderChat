<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$variables = [
      'post' => $variables['post'],
      'foto_url' => $variables['foto_url'],
      'video_url' => $variables['video_url'],
      'user_id' => $variables['user_id'],
    ];

    $postar = api_request('create_new_post', 'GET', $variables);

    if(isset($variables['r'])){

      if($variables['r'] == 'perfil'){
        header('Location: /upper/app?r=perfil');
        die();
      }
    
    }
    header('Location: /upper/app');
    die();