<?php
defined("ROOT") or die("Acesso negado");
?>
<section class="area-chat" id="area-chat">
    <section class="bate-papo" id="batePapo">
        <header class="perfil-bate-papo" id="cabecalhoBatePapo">
            <div>
                <?php if (!empty($_SESSION['photo_url'])) : ?>
                    <img src="assets/images/<?= $_SESSION['photo_url'] ?>" alt="">
                <?php else : ?>
                    <img src="assets/images/sem-foto.jpg" alt="">
                <?php endif; ?>
                <div class="online"></div>
            </div>
            <div>
                <h3>Mensagens</h3>
            </div>
        </header>
        <hr>
        <section class="conversa-bate-papo" id="conversa-bate-papo">
        </section>
    </section>
</section>