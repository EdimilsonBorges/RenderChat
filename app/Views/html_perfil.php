<?php
defined("ROOT") or die("Acesso negado");
?>

<section class="container-cabecalho-p">
    <article class="cabecalho-p">
        
    </article>
    <article class="container-corpo-p">
        <section class="container-lateral-p">
            <nav>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget enim vitae quam pulvinar
                    faucibus ac eget odio. Aliquam viverra turpis a dapibus bibendum. Phasellus vitae neque vitae
                    mauris ornare volutpat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus. Praesent rhoncus metus eu dictum pellentesque. Suspendisse lacinia iaculis lorem
                    ut scelerisque. Sed in augue sed mi rhoncus porta. Pellentesque pharetra sed arcu eget cursus.
                    Sed et diam sem. Integer ultrices a arcu at consequat. Pellentesque lacinia risus nisi, at
                    pretium erat vehicula sed.</p>
            </nav>
            <nav>
                <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc
                    non eleifend mi. Donec suscipit nulla congue hendrerit facilisis. Suspendisse potenti. Aliquam
                    tempor ex vel tristique pharetra. Nunc commodo lectus dolor, vel vulputate est commodo nec.
                    Vestibulum a augue finibus, efficitur turpis et, dignissim justo. Vestibulum sed urna at metus
                    gravida blandit. Curabitur ac molestie justo, quis rutrum nulla. Vivamus lacinia risus at lectus
                    aliquet, nec luctus orci volutpat. Nam imperdiet pharetra nisi, ac commodo dui.</p>
            </nav>
            <nav>
                <p>Etiam quis lorem ut justo tincidunt finibus et nec dolor. Nam vitae pharetra risus, sed mattis
                    dui. Maecenas in accumsan lorem, eu pharetra nisi. Nunc sollicitudin eget est at porttitor. Sed
                    posuere, metus ac efficitur imperdiet, ex eros pulvinar magna, sit amet aliquet felis lorem at
                    diam. Cras laoreet enim dictum feugiat pulvinar. Aliquam consectetur volutpat facilisis. Ut ut
                    est et justo molestie rutrum. Nulla condimentum egestas nunc, nec cursus purus semper placerat.
                    Praesent bibendum leo nibh, non tincidunt nunc suscipit sed. Maecenas imperdiet, tellus eu
                    rhoncus tincidunt, dui mauris mattis magna, ut faucibus sem dolor ut lectus. Nam mollis tempus
                    tortor.</p>
            </nav>
        </section>

        <article class="posts" id="posts">
            <section class="publicar">
                <div class="perfil">
                    <?php if (!empty($_SESSION['photo_url'])) : ?>
                        <img src="assets/images/<?= $_SESSION['photo_url'] ?>" alt="">
                    <?php else : ?>
                        <img src="assets/images/sem-foto.jpg" alt="">
                    <?php endif; ?>
                    <button class="btnPublicar" type="text" name="" id="btnPublicarPerfil">Criar nova publicação</button>
                </div>
                <div class="links">
                    <a href="#">Foto</a>
                    <a href="#">Vídeo</a>
                    <a href="#">Evento</a>
                </div>
            </section>
            <hr class="divisaoPost">

        </article>

    </article>
</section>

</section>