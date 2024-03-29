<?php

//require_once('../inc/authentication.php');
require_once('../inc/database.php');
require_once('../inc/config.php');
require_once('../inc/api_encript.php');

$db = new database();

$variables = filter_input_array(INPUT_GET, FILTER_DEFAULT);

if (empty($variables['user_id']) || empty($variables['limit'])) {
    error_response("Não existe nenhum usuário logado");
}

$param = [
    ':user_id' => api_encript::aesDesencriptar($variables['user_id']),
];

$results = $db->select(
    "SELECT pos.*, usu.deleted_at, usu.first_name, usu.last_name, perf.photo_url, li.post_id AS li_post_id, sh.user_id AS sh_user_id, us.first_name AS sh_first_name, us.last_name AS sh_last_name, per.photo_url AS sh_photo_url, u.first_name AS lik_first_name, u.last_name AS lik_last_name, pe.photo_url AS lik_photo_url, u.id AS lik_user_id, sh.created_at AS sh_created_at,
        (SELECT hs.comment FROM shares hs WHERE hs.post_id = pos.id AND hs.user_id = sh_user_id ORDER BY hs.created_at DESC LIMIT 1) AS sh_comment,
        (SELECT COUNT(lk.post_id) FROM likes lk WHERE lk.post_id = pos.id) AS t_likes,
        (SELECT COUNT(cs.post_id) FROM comments cs WHERE cs.post_id = pos.id) AS t_comments,
        (SELECT COUNT(ss.post_id) FROM shares ss WHERE ss.post_id = pos.id) AS t_shares
    FROM posts pos

    INNER JOIN users AS usu ON usu.id = pos.user_id AND usu.deleted_at IS NULL
    LEFT JOIN perfil AS perf ON perf.user_id = pos.user_id
    
    LEFT JOIN likes AS li ON li.post_id = pos.id AND li.user_id = :user_id
    
    LEFT JOIN shares AS sh ON sh.post_id = pos.id AND sh.created_at >= pos.modified_at
    LEFT JOIN users AS us ON us.id = sh.user_id AND usu.deleted_at IS NULL
    LEFT JOIN perfil AS per ON per.user_id = sh.user_id
    
    LEFT JOIN likes AS lik ON lik.post_id = pos.id AND lik.created_at >= pos.modified_at
    LEFT JOIN users AS u ON u.id = lik.user_id
    LEFT JOIN perfil AS pe ON pe.user_id = lik.user_id
    
    WHERE pos.user_id = :user_id
    GROUP BY pos.id
    ORDER BY pos.modified_at DESC
    LIMIT ".$variables['limit']." OFFSET ".$variables['offset'],
    $param
);


$resposta = [];

foreach ($results as $result) {


$dataDaCriacao = $result->created_at;

// Configura a zona de tempo para o horário brasileiro
date_default_timezone_set('America/Sao_Paulo');

// Obtém a data e hora atual
$dataAtual = new DateTime();

// Converte a data fornecida em um objeto DateTime
$dataDaCriacaoObj = DateTime::createFromFormat('Y-m-d H:i:s', $dataDaCriacao);

// Calcula a diferença entre as duas datas
$diferenca = $dataAtual->diff($dataDaCriacaoObj);

// Obtém os componentes da diferença
$anos = $diferenca->y;
$meses = $diferenca->m;
$dias = $diferenca->d;
$horas = $diferenca->h;
$minutos = $diferenca->i;
$segundos = $diferenca->s;

// Exibe o resultado
    if($anos > 0){
        if($anos > 1){
        $tempo = $anos." Anos atrás";
        }else{
        $tempo = $anos." Ano atrás";
        }
    }else if($meses > 0){
        if($meses > 1){
            $tempo = $meses." Meses atrás";
        }else{
            $tempo = $meses." Mês atrás";
        }
    }else if($dias > 0){
        if($dias > 1){
            $tempo = $dias." Dias atrás";
        }else{
            $tempo = $dias." Dia atrás";
        }
    }else if($horas > 0){
        if($horas > 1){
            $tempo = $horas." Horas atrás";
        }else{
            $tempo = $horas." Hora atrás";
        }
    }else if($minutos > 0){
        if($minutos > 1){
            $tempo = $minutos." Minutos atrás";
        }else{
            $tempo = $minutos." Minuto atrás";
        }
    }else{
        if($segundos > 1){
            $tempo = $segundos." Segundos atrás";
        }else{
            $tempo = $segundos." Segundo atrás";
        }
    }

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
        'created_at' => $tempo,
        't_likes' => $result->t_likes,
        't_comments' => $result->t_comments,
        't_shares' => $result->t_shares,
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
