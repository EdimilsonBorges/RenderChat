<?php

require_once('../inc/config.php');
require_once('../inc/api_functions.php');


$variables = $_GET;

$variables = [
      'user_id' => $variables['user_id'],
      'post_id' => $variables['post_id'],
      'comment' => nl2br($variables['comment']),
    ];

$share = api_request('create_new_share', 'GET', $variables);

if(isset($_GET['r'])){

  if($_GET['r'] == 'perfil'){
   header('Location: /upper/app?r=perfil');
    die();
  }

}
header('Location: /upper/app');
die();









// $curtir = api_request('pesq_users', "GET", $_GET);

// echo '</pre>';
// print_r($curtir);

// $users = api_request('get_all_users');
//             foreach($users['results'] as $user){
//                 echo $user['first_name'];
//             }

           // echo '<pre>';
           // print_r($users);
            