<?php

//require_once('output.php');
require_once(dirname(__FILE__) .'/inc/database.php');
require_once(dirname(__FILE__) . '/inc/api_response.php');
require_once(dirname(__FILE__) . '/inc/config.php');
require_once(dirname(__FILE__) . '/inc/api_logic.php');

$api_response = new api_response();

if (!$api_response->check_method($_SERVER['REQUEST_METHOD'])) {
    $api_response->api_request_error('Método inválido');
}

$api_response->set_method($_SERVER['REQUEST_METHOD']);

$params = null;
if ($api_response->get_method() == 'GET') {
    $api_response->set_endpoint(filter_input(INPUT_GET, "endpoint", FILTER_DEFAULT));
    $params = $_GET;
} elseif ($api_response->get_method() == 'POST') {
    $api_response->set_endpoint(filter_input(INPUT_POST, "endpoint", FILTER_DEFAULT));
    $params = $_POST;
}

$api_logic = new api_logic($api_response->get_endpoint(), $params);

if(!$api_logic->endpoint_exists()){
    $api_response->api_request_error('Endpoint inválido '.$api_response->get_endpoint());
}
$endpoint = $api_response->get_endpoint();
$result = $api_logic->$endpoint();
//$result = $api_logic->{$api_response->get_endpoint()}();

$api_response->add_to_data('data', $result);

$api_response->send_response();

//$api_response->send_api_status();
