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
            <div>
                <h3>Mensagens</h3>
            </div>
            <div class="divTotalHistory" id="divTotalHistory" style="width:27px; font-size: 10pt; color: #fff; height: 21px; padding-top: 5px; background-color:rgb(141 0 0 / 80%); position: relative; left: 153px; top: 17px; border-radius: 50%;text-align: center; font-weight: bold;">0</div>
        </header>
        <hr>
        <section class="conversa-bate-papo" id="conversa-bate-papo">
        </section>
    </section>
</section>