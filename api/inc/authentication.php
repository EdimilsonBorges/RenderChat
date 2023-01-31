<?php

require_once(dirname(__FILE__) . '/api_response.php');
require_once(dirname(__FILE__) . '/database.php');
require_once(dirname(__FILE__) . '/config.php');


$api_response = new api_response();

if(empty($_SERVER['PHP_AUTH_USER']) || empty($_SERVER['PHP_AUTH_PW'])){
    $api_response->api_request_error('Acesso negado!');
}

$db = new database();

$params = [
    ':user_name' => $_SERVER['PHP_AUTH_USER'],
];

$results = $db->select('SELECT * FROM `authentication` WHERE user_name = :user_name', $params);

if(count($results) > 0){
   
    $usuario = $results[0];

    if(password_verify($_SERVER['PHP_AUTH_PW'], $usuario->pass)){
        $valid_authentication = true;
    }else{
        $valid_authentication = false;
    }
}else{
    $valid_authentication = false;
}

if(!$valid_authentication){
    $api_response->api_request_error('Authentication inválido!');
}