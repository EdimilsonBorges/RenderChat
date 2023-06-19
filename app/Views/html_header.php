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
        <?php if ($_GET['r'] == 'convites') : ?>
            <link rel="stylesheet" href="assets/css/menu.css">
            <link rel="stylesheet" href="assets/css/chat.css">
        <?php endif; ?>
        <?php if ($_GET['r'] == 'messeger') : ?>
            <link rel="stylesheet" href="assets/css/menu.css">
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
                                } ?>"><a href="?r=home">Linha do tempo</a></li>
                <li class="menu <?php if (isset($_GET['r']) && $_GET['r'] == 'perfil') {
                                    echo 'active';
                                } ?>"><a href="?r=perfil">Perfil</a></li>
                <li class="menu <?php if (isset($_GET['r']) && $_GET['r'] == 'friends') {
                                    echo 'active';
                                } ?>"><a href="?r=friends">Amigos</a></li>
                <li class="menu <?php if (isset($_GET['r']) && $_GET['r'] == 'convites') {
                                    echo 'active';
                                } ?>"><a href="?r=convites">Convites</a></li>
                <li class="menu <?php if (isset($_GET['r']) && $_GET['r'] == 'messeger') {
                                    echo 'active';
                                } ?>"><a href="?r=messeger">Mensagens</a></li>
                <li class="menu <?php if (isset($_GET['r']) && $_GET['r'] == 'notifly') {
                                    echo 'active';
                                } ?>"><a href="?r=notifly">Notificações</a></li>
                <li class="menu <?php if (isset($_GET['r']) && $_GET['r'] == 'config') {
                                    echo 'active';
                                } ?>"><a href="?r=config">Configurações</a></li>
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
        <div class="conta">
            <img class="per" src="assets/images/<?= $_SESSION['photo_url'] ?>">
            <span><?= $_SESSION['first_name'] . " " . $_SESSION['last_name'] ?></span>
            <img src="assets/icons/mais.svg">
        </div>
    </header>