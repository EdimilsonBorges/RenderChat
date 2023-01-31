<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = $_GET;

$variables = [
      'post' => $variables['post'],
      'foto_url' => $variables['foto_url'],
      'video_url' => $variables['video_url'],
      'users_id' => $variables['users_id'],
    ];

    $postar = api_request('create_new_post', 'GET', $_GET);

    if(isset($_GET['r'])){

      if($_GET['r'] == 'perfil'){
        header('Location: /upper/app?r=perfil');
        die();
      }
    
    }
    header('Location: /upper/app');
    die();