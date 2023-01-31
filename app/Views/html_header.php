<?php
defined("ROOT") or die("Acesso negado");
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upper</title>

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
    <input id="userId" type="hidden" name="" value='<?= $_SESSION['user_id'] ?>'>
    <input id="nameC" type="hidden" name="" value='<?= $_SESSION['first_name'] . " " . $_SESSION['last_name'] ?>'>
    <input id="photo" type="hidden" name="" value='<?= $_SESSION['photo_url'] ?>'>
    <header class="principal">
        <div>
            <img src="assets/images/logo.png" alt="">
            <input type="search" name="" id="" onkeyup="showHint(this.value)" placeholder="Pesquisar">
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
        </nav>
    </header>