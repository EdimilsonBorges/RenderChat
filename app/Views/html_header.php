<?php
defined("ROOT") or die("Acesso negado");
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-ico">
    <title>RenderChat</title>

    <?php
    if (isset($_GET['r'])) : ?>
        <?php if ($_GET['r'] == 'home') : ?>
            <link rel="stylesheet" href="assets/css/menu.css">
            <link rel="stylesheet" href="assets/css/linhaDoTempo.css">
            <link rel="stylesheet" href="assets/css/chat.css">
        <?php endif; ?>
        <?php if ($_GET['r'] == 'perfil') : ?>
            <link rel="stylesheet" href="assets/css/menu.css">
            <link rel="stylesheet" href="assets/css/perfil.css">
            <link rel="stylesheet" href="assets/css/chat.css">
        <?php endif; ?>
        <?php if ($_GET['r'] == 'friends') : ?>
            <link rel="stylesheet" href="assets/css/menu.css">
            <link rel="stylesheet" href="assets/css/friends.css">
            <link rel="stylesheet" href="assets/css/chat.css">
        <?php endif; ?>
        <?php if ($_GET['r'] == 'messeger') : ?>
            <link rel="stylesheet" href="assets/css/menu.css">
            <link rel="stylesheet" href="assets/css/messeger.css">
        <?php endif; ?>
        <?php if ($_GET['r'] == 'notifly') : ?>
            <link rel="stylesheet" href="assets/css/menu.css">
        <?php endif; ?>
        <?php if ($_GET['r'] == 'config') : ?>
            <link rel="stylesheet" href="assets/css/menu.css">
        <?php endif; ?>
    <?php else : ?>
        <link rel="stylesheet" href="assets/css/menu.css">
        <link rel="stylesheet" href="assets/css/linhaDoTempo.css">
        <link rel="stylesheet" href="assets/css/chat.css">
    <?php endif; ?>

    <link rel="shortcut icon" href="logo.png" type="image/x-icon">
</head>

<body>
    <header class="principal" id="principal" data-userid='<?= $_SESSION['user_id'] ?>' data-perfid='<?= $_SESSION['user_id'] ?>' data-namec='<?= $_SESSION['first_name'] . " " . $_SESSION['last_name'] ?>' data-photo='<?= $_SESSION['photo_url'] ?>'>
        <div class="logoPesquisa">
            <img src="assets/images/logo.png" alt="">
            <input type="search" name="pesqClients" onkeyup="showHint(this.value)" placeholder="Pesquisar">
        </div>
        <nav>
            <ul>
                <li class="menu <?php if (!isset($_GET['r']) || $_GET['r'] == 'home') {
                                    echo 'active';
                                } ?>"><a href="?r=home"><svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path fill="#fff" d="M184.27-144.27v-444.332L480-811.024 775.73-588.26v443.99H557.602v-265.795H402.923v265.795H184.27Z"/></svg>Home</a></li>
                <li class="menu <?php if (isset($_GET['r']) && $_GET['r'] == 'perfil') {
                                    echo 'active';
                                } ?>"><a href="?r=perfil"><svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path fill="#fff" d="M480.015-492.245q-57.123 0-94.947-37.808-37.823-37.809-37.823-94.932 0-57.379 37.809-95.075 37.808-37.695 94.931-37.695t94.947 37.681q37.823 37.68 37.823 95.06 0 57.123-37.809 94.946-37.808 37.823-94.931 37.823ZM184.27-193.861v-77.408q0-31.014 16.382-54.672 16.381-23.658 43.243-36.421 61.427-27.847 119.709-42.204 58.281-14.356 116.402-14.356t116.237 14.384q58.115 14.385 119.604 42.269 27.146 12.657 43.514 36.369 16.369 23.713 16.369 54.792v77.247H184.27Z"/></svg>Perfil</a></li>
                <li class="menu <?php if (isset($_GET['r']) && $_GET['r'] == 'friends') {
                                    echo 'active';
                                } ?>"><a href="?r=friends"><svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path fill="#fff" d="M40-160v-160q0-29 20.5-49.5T110-390h141q17 0 32.5 8.5T310-358q29 42 74 65t96 23q51 0 96-23t75-65q11-15 26-23.5t32-8.5h141q29 0 49.5 20.5T920-320v160H660v-119q-36 33-82.5 51T480-210q-51 0-97-18t-83-51v119H40Zm440-170q-35 0-67.5-16.5T360-392q-16-23-38.5-37T273-448q29-30 91-46t116-16q54 0 116.5 16t91.5 46q-26 5-48.5 19T601-392q-20 29-52.5 45.5T480-330ZM160-460q-45 0-77.5-32.5T50-570q0-46 32.5-78t77.5-32q46 0 78 32t32 78q0 45-32 77.5T160-460Zm640 0q-45 0-77.5-32.5T690-570q0-46 32.5-78t77.5-32q46 0 78 32t32 78q0 45-32 77.5T800-460ZM480-580q-45 0-77.5-32.5T370-690q0-46 32.5-78t77.5-32q46 0 78 32t32 78q0 45-32 77.5T480-580Z"/></svg>Amigos</a></li>
                <li class="menu <?php if (isset($_GET['r']) && $_GET['r'] == 'messeger') {
                                    echo 'active';
                                } ?>"><a href="?r=messeger"><svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path fill="#fff" d="M252.847-411.962h292.345v-47.883H252.847v47.883Zm0-123.923h454.306v-47.884H252.847v47.884Zm0-123.923h454.306v-47.884H252.847v47.884ZM104.745-125.579v-669.982q0-24.582 17.793-42.375 17.793-17.794 42.314-17.794h630.296q24.521 0 42.314 17.794 17.793 17.793 17.793 42.322v471.228q0 24.529-17.793 42.322-17.793 17.794-42.313 17.794H243.436L104.745-125.579Z"/></svg>Mensagens</a></li>
                <li class="menu"><a class="menu-notify"><svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path fill="#fff" d="M183.347-208.436v-47.883h69.936v-305.835q0-80.577 49.578-143.654 49.579-63.076 128.088-79.397v-20.885q0-20.628 14.159-34.909 14.158-14.282 34.768-14.282 20.611 0 34.893 14.282 14.282 14.281 14.282 34.909v20.885q78.743 16.321 128.467 79.397 49.725 63.077 49.725 143.654v305.835h69.935v47.883H183.347ZM479.932-98.001q-29.355 0-50.323-21.015-20.967-21.016-20.967-50.343h142.716q0 29.423-21.035 50.391-21.036 20.967-50.391 20.967Z"/></svg>Notificações</a></li>
                <li class="menu <?php if (isset($_GET['r']) && $_GET['r'] == 'config') {
                                    echo 'active';
                                } ?>"><a href="?r=config"><svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path fill="#fff" d="m399.232-104.745-17.128-119.346q-14.026-4.256-36.078-16.538-22.052-12.283-43.616-28.321l-110.256 48.897-81.678-143.741 98.974-73.205q-1.987-10.026-2.673-20.834-.686-10.808-.686-21.782 0-9.142.769-20.622.77-11.481 2.564-23.712l-98.948-73.513 81.678-142.241L303-690.973q16.218-13.244 37.129-25.443 20.91-12.199 41.59-18.852l17.513-120.462h162.062l17.128 119.731q20.667 7.59 40.494 18.968 19.827 11.378 36.571 26.058l113.141-48.73 81.422 142.241-101.936 74.538q2.039 11.18 2.827 21.719.789 10.538.789 21.205 0 10.09-.885 20.757-.885 10.666-2.962 22.244l100.949 73.205-81.679 143.741-111.666-49.756q-16.628 14.436-35.898 26.18-19.269 11.744-41.167 19.154l-17.128 119.73H399.232Zm79.229-262.5q47.077 0 79.916-32.839 32.84-32.84 32.84-79.916 0-47.076-32.84-79.916-32.839-32.839-79.916-32.839-47.384 0-80.069 32.839-32.686 32.84-32.686 79.916 0 47.076 32.686 79.916 32.685 32.839 80.069 32.839Z"/></svg>Configurações</a></li>
            </ul>

            <!-- <ul>
                <li class="menu" id="menuHome"><a href="?r=home">Linha do tempo</a></li>
                <li class="menu" id="menuPerfil"><a href="?r=perfil">Perfil</a></li>
                <li class="menu" id="menuFriends"><a href="?r=friends">Amigos</a></li>
                <li class="menu" id="menuConvites"><a href="?r=convites">Convites</a></li>
                <li class="menu" id="menuMesseger"><a href="?r=messeger">Mensagens</a></li>
                <li class="menu" id="menuNotifly"><a href="?r=notifly">Notificações</a></li>
                <li class="menu" id="menuConfig"><a href="?r=config">Configurações</a></li> 
            </ul>-->
        </nav>
        <div class="conta" id="conta">
            <?php if (is_null($_SESSION['photo_url'])):?>
                <img class="per" src="assets/images/sem-foto.jpg">
            <?php else:?>
                <img class="per" src="assets/images/<?= $_SESSION['photo_url'] ?>">
            <?php endif;?>
            <span><?= $_SESSION['first_name'] . " " . $_SESSION['last_name'] ?></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="30"><path fill="#fff" d="M480-360 280-559h400L480-360Z"/></svg>
        </div>
        <nav class="navLinkConta" id="navLinkConta">
                <a href="?r=perfil"><img src="assets/icons/person.svg">Conta</a>
                <a href="#"><img src="assets/icons/settings.svg">Configurações</a>
                <a href="?r=logout"><img src="assets/icons/logout.svg">Sair</a>
        </nav>
    </header>