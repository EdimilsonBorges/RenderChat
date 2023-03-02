<?php

//require_once('../inc/authentication.php');


require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (empty($variables['user_id'])) {
    error_response("Não existe nenhum usuário logado");
}

$param = [
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
];

$results = $db->select(
    'SELECT pos.*, usu.deleted_at, usu.first_name, usu.last_name, perf.photo_url, li.post_id AS li_post_id, sh.user_id AS sh_user_id, us.first_name AS sh_first_name, us.last_name AS sh_last_name, per.photo_url AS sh_photo_url, u.first_name AS lik_first_name, u.last_name AS lik_last_name, pe.photo_url AS lik_photo_url, u.id AS lik_user_id, sh.created_at AS sh_created_at,
    (SELECT hs.comment FROM shares hs WHERE hs.post_id = pos.id AND hs.user_id = sh_user_id ORDER BY hs.created_at DESC LIMIT 1) AS sh_comment
    FROM posts pos 
    INNER JOIN users AS usu ON usu.id = pos.user_id AND usu.deleted_at IS NULL
    LEFT JOIN perfil AS perf ON perf.user_id = pos.user_id
    
    LEFT JOIN likes AS li ON li.post_id = pos.id AND li.user_id = 1
    
    LEFT JOIN shares AS sh ON sh.post_id = pos.id AND sh.created_at >= pos.modified_at
    LEFT JOIN users AS us ON us.id = sh.user_id AND usu.deleted_at IS NULL
    LEFT JOIN perfil AS per ON per.user_id = sh.user_id
    
    LEFT JOIN likes AS lik ON lik.post_id = pos.id AND lik.created_at >= pos.modified_at
    LEFT JOIN users AS u ON u.id = lik.user_id
    LEFT JOIN perfil AS pe ON pe.user_id = lik.user_id
    
    GROUP BY pos.id
    ORDER BY pos.modified_at DESC
    LIMIT 200 OFFSET 0',
    $param
);


$resposta = [];

foreach ($results as $result) {


    $params = [
        ':post_id' => $result->id,
    ];
    
    $totals = $db->select("SELECT post_id, COUNT(*) totals FROM likes WHERE post_id = :post_id UNION ALL 
                            SELECT post_id, COUNT(*)  FROM comments WHERE post_id = :post_id UNION ALL 
                            SELECT post_id, COUNT(*)  FROM shares WHERE post_id = :post_id", $params);

    if($result->lik_user_id != null){
        $lik_user_id = api_encript::aesEncriptar($result->lik_user_id);
    }else{
        $lik_user_id = null;
    }

    if($result->sh_user_id != null){
        $sh_user_id = api_encript::aesEncriptar($result->sh_user_id);
    }else{
        $sh_user_id = null;
    }
    
     array_push($resposta, [
        'id' => api_encript::aesEncriptar($result->id),
        'user_id' => api_encript::aesEncriptar($result->user_id),
        'sh_user_id' => $sh_user_id,
        'lik_user_id' => $lik_user_id,
        'post' => $result->post,
        'li_post_id' => $result->li_post_id,
        'sh_comment' => $result->sh_comment,
        'sh_created_at' => $result->sh_created_at,
        'sh_first_name' => $result->sh_first_name,
        'sh_last_name' => $result->sh_last_name,
        'sh_photo_url' => $result->sh_photo_url,
        'lik_first_name' => $result->lik_first_name,
        'lik_last_name' => $result->lik_last_name,
        'lik_photo_url' => $result->lik_photo_url,
        'first_name' => $result->first_name,
        'last_name' => $result->last_name,
        'photo_url' => $result->photo_url,
        'created_at' => $result->created_at,
        't_likes' => $totals[0]->totals,
        't_comments' => $totals[1]->totals,
        't_shares' => $totals[2]->totals,
    ]);
}


sucess_response("", $resposta);

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
    return;
}

function error_response($mensage, $results = [])
{
    header("Content-Type:application/json");
    echo json_encode(
        [
            'status' => 'ERROR',
            'message' => $mensage,
            'results' => $results,
        ],
    );
    return;
}
