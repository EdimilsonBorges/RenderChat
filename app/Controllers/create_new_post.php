<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$resultado = "Erro desconhecido!!!";

if (!empty($_GET)) {
    $variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);
    $resultado = api_request('create_new_post', 'GET', $variables);

    if($resultado["status"] != "SUCESS"){
      $resultado = array('message' => 'Erro da api ao criar post');
      header("Content-Type:application/json");
      echo json_encode($resultado);
      exit;
    }

} else {
    $resultado = array('message' => 'Nenhum dado do app foi recebido');
    header("Content-Type:application/json");
    echo json_encode($resultado);
    exit;
}

if(isset($variables['r'])){

  if($variables['r'] == 'perfil'){
    header('Location: /upper/app?r=perfil');
    die();
  }else{
    header('Location: /upper/app');
    die();
  }
}
