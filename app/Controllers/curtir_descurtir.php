<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$resultado = "Erro desconhecido!!!";
header("Content-Type:application/json");

if (!empty($_GET)) {
  // Receber os dados GET
  $variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);
  
  $resultado = api_request('create_new_like', 'GET', $variables);

  if($resultado["status"] != "SUCESS"){
    $resultado = array('message' => 'Erro da api ao curtir/descurtir uma publicação');
  }
  
} else {
  $resultado = array('message' => 'Nenhum dado do app foi recebido');
}

echo json_encode($resultado);
exit;