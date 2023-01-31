<?php

function api_request($endpoint, $method = 'GET', $variables = [])
{
    $client = curl_init();

    $headers = [
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode(API_USER . ':' . API_PASS) // envia os campos de authentication para o $_SERVER
    ];

    curl_setopt($client, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($client, CURLOPT_RETURNTRANSFER, true);

    $url = API_BASE_ENDPOINT . $endpoint . '/'; // contrói a url

    if ($method == 'GET') { // verifica se o método é GET
        if (!empty($variables)) {  // verifica se o array não está vazio
            $url .= '?'.http_build_query($variables); //insere um array no link da quere para receber as variáveis por $_GET
        }
    } 

    if($method == 'POST'){ // verifica se o método é POST
        $variables = array_merge(['endpoint' => $endpoint], $variables); //coloca o campo endpoint no array variables
        curl_setopt($client, CURLOPT_POSTFIELDS, $variables); // insere um array no $_POST
    }



    curl_setopt($client, CURLOPT_URL, $url);

    $response = curl_exec($client);

    if(curl_errno($client)){
      throw new Exception(curl_errno($client));
    }

    curl_close($client);

    return json_decode($response, true);
}
