<?php

require_once('../inc/authentication.php');
require_once('../inc/api_encript.php');


$params = $_GET;

$params = [
    ':post_id' => api_encript::aesDesencriptar($params['post_id']),
];

$results = $db->select("SELECT post_id, COUNT(*) totals FROM likes WHERE post_id = :post_id UNION ALL 
                        SELECT post_id, COUNT(*)  FROM comments WHERE post_id = :post_id UNION ALL 
                        SELECT post_id, COUNT(*)  FROM shares WHERE post_id = :post_id", $params);

echo json_encode(
    [
        'status' => 'SUCESS',
        'message' => '',
        'results' => $results,
    ],
);
exit;