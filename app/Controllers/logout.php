<?php
defined("ROOT") or die("Acesso negado");

// Remove dados da sessão
if(isset($_SESSION["user_id"])){
    unset($_SESSION["user_id"]);
}

if(isset($_SESSION["first_name"])){
    unset($_SESSION["first_name"]);
}

if(isset($_SESSION["last_name"])){
    unset($_SESSION["last_name"]);
}

if(isset($_SESSION["photo_url"])){
    unset($_SESSION["photo_url"]);
}

header('Location: /RenderChat/app');
return;