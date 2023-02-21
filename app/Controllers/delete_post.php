<?php

// deletar um post fisicamente

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

$resultado = api_request('delete_post', 'GET', $variables);

if(isset($variables['r'])){

    if($variables['r'] == 'perfil'){
      header('Location: /upper/app?r=perfil');
      die();
    }
  
  }
  header('Location: /upper/app');
  die();