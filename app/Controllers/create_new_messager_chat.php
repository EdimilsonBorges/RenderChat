<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$resultado = "Erro desconhecido!!!";
header("Content-Type:application/json");

if (!empty($_GET)) {
    $variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);
    $resultado = api_request('create_new_messager_chat', 'GET', $variables);

    if($resultado["status"] != "SUCESS"){
        $resultado = array('message' => 'Erro da api ao buscar os comentários');
    }
    
  } else {
    $resultado = array('message' => 'Nenhum dado do app foi recebido');
}

echo json_encode($resultado);
exit;