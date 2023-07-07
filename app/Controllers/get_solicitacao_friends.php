<?php
require_once('../inc/config.php');
require_once('../inc/api_functions.php');

$resultado = "Erro desconhecido!!!";
header("Content-Type:application/json");

if (!empty($_GET)) {
    $variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);
    $resultado = api_request('get_solicitacao_friends', 'GET', $variables);

    if($resultado["status"] != "SUCESS"){
        $resultado = array('message' => 'Erro da api ao receber dados dos friends');
    }

} else {
    $resultado = array('message' => 'Nenhum dado do app foi recebido');
}

echo json_encode($resultado);
exit;