<?php
defined("ROOT") or die("Acesso negado");
?>
<section class="area-chat" id="area-chat">
    <section class="bate-papo" id="batePapo">
        <header class="perfil-bate-papo" id="cabecalhoBatePapoPrincipal">
            <div>
                <?php if (!empty($_SESSION['photo_url'])) : ?>
                    <img src="assets/images/<?= $_SESSION['photo_url'] ?>" alt="">
                <?php else : ?>
                    <img src="assets/images/sem-foto.jpg" alt="">
                <?php endif; ?>
                <div class="online"></div>
            </div>
            <div class=tituloChat>
                <h3>Mensagens</h3>
            </div>
            <div class="divTotalHistory ocultar">0</div>
            <div class="imgMinimizarChat"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m286.462-358.463-32.615-32.614L480-617.23l226.153 225.537-32.615 32.615L480-552.616 286.462-358.463Z"/></svg></div>
        </header>
        <hr>
        <section class="conversa-bate-papo" id="conversa-bate-papo">
        </section>
    </section>
</section>