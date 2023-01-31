<?php

// editar um post

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$variables = $_GET;

$resultado = api_request('update_post', 'GET', $variables);

if(isset($_GET['r'])){

    if($_GET['r'] == 'perfil'){
      header('Location: /upper/app?r=perfil');
      die();
    }
  
  }
  header('Location: /upper/app');
  die();