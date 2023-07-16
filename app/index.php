<?php

session_start();
define("ROOT", true);

require_once(dirname(__DIR__) . '\\app\\inc\\config.php');
require_once(dirname(__DIR__) . '\\app\\inc\\api_functions.php');

//define rotas
$rotas = '';

// if(!empty(filter_input(INPUT_GET,"url", FILTER_DEFAULT))){
//     $url =  filter_input(INPUT_GET,"url", FILTER_DEFAULT);
//     $urlConjunto = explode("/", $url);
//     if(isset($urlConjunto[0])){
//         $urlController = $urlConjunto[0];
//     }else{
//         $urlController = "login";
//     }

//     if(isset($urlConjunto[1])){
//         $urlMetodo = $urlConjunto[1];
//     }else{
//         $urlMetodo = "home";
//     }
//     if(isset($urlConjunto[2])){
//         $urlParametro = $urlConjunto[2];
//     }else{
//         $urlParametro = "";
//     }
// }else{
//     $urlController = "login_submit";
//     // $urlController = "login";
//     // $urlMetodo = "home";
//     // $urlParametro = "";
// }

// $rotas = $urlController;


if (!isset($_SESSION['user_id']) && $_SERVER['REQUEST_METHOD'] != 'POST') {
    $rotas = 'login';
} elseif (!isset($_SESSION['user_id']) && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $rotas = 'login_submit';
} else {

    if (isset($_GET['r'])) {

        $rotas = $_GET['r'];
    }else{
        $rotas = 'home';
    }
    
}


switch ($rotas) {
    case 'login':
        require_once(dirname(__DIR__) . '\\app\\Views\\html_login.php');
        break;
    case 'login_submit':
        require_once(dirname(__DIR__) . '\\app\\Controllers\\login_submit.php');
        break;

    case 'logout':
        require_once(dirname(__DIR__) . '\\app\\Controllers\\logout.php');
        break;

    case 'home':
        require_once(dirname(__DIR__) . '\\app\\Views\\html_header.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_chat.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_linha_do_tempo.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_modals.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_footer.php');
        break;

    case 'perfil':
        require_once(dirname(__DIR__) . '\\app\\Views\\html_header.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_chat.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_perfil.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_modals.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_footer.php');
        break;

    case 'friends':
        require_once(dirname(__DIR__) . '\\app\\Views\\html_header.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_chat.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_friends.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_footer.php');
        break;

    case 'messeger':
        require_once(dirname(__DIR__) . '\\app\\Views\\html_header.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_messeger.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_footer.php');
        break;

    case 'notifly':
        require_once(dirname(__DIR__) . '\\app\\Views\\html_header.php');
        require_once(dirname(__DIR__) . '\\app\\Views\\html_footer.php');
        break;

    case 'config':
        require_once(dirname(__DIR__) . '\\app\\Views\\html_header.php');

        require_once(dirname(__DIR__) . '\\app\\Views\\html_footer.php');
        break;

    default:
        echo "rota não definida";
        break;
}
