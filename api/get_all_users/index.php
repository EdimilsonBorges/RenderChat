<?php

require_once('../inc/authentication.php');

$results = $db->select('SELECT * FROM users');
sucess_response("", $results);


function sucess_response($mensage, $results = [])
{
    header("Content-Type:application/json");
    echo json_encode(
        [
            'status' => 'SUCESS',
            'message' => $mensage,
            'results' => $results,
        ],
    );
}