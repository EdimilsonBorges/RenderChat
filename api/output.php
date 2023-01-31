<?php

function api_status(&$data)
{
    define_response($data, "A api está funcionando normalmente!!!");
}

function define_response(&$data, $value)
{
    $data["status"] = "SUCESS";
    $data["data"] = $value;
}

function resposta($data_resposta)
{
    header("Content-Type:application/json");
    echo json_encode($data_resposta);
}