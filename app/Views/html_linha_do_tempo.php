<?php
defined("ROOT") or die("Acesso negado");
?>

<section class="container-corpo">
    <nav class="esquerda">
        <section>
            <p id="txtHint"></p>
            <p>
                Suspendisse potenti. Suspendisse pulvinar ultricies accumsan. Vivamus vel ullamcorper magna. Sed
                tempor iaculis purus ut rhoncus. Proin rutrum, arcu sit amet fringilla venenatis, orci dolor
                sagittis urna, in fringilla libero nisl ut nisl.
            </p>
        </section>
        <section>
            <p>
                Maecenas eget eros at lacus laciniue senectus et netus et malesuada fames ac turpis egestas.
                Vestibulum iaculis purus ligula. Fusce semper ligula dui, suscipit vestibulum leo tristique
                quis. Donec fermentum, est sit amet eleifend lobortis, libero orci fermentum mi, rutrum interdum
                nisl metus a odio.</p>
            <p>
                Suspendisse potenti. Suspendisse pulvinar ultricies accumsan. Vivamus vel ullamcorper magna. Sed
                tempor iaculis purus ut rhoncus. Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas. rutrum, arcu sit amet fringilla venenatis, orci dolor
                sagittis urna, in fringilla libero nisl ut nisl.
            </p>
        </section>
    </nav>
    
    <article class="posts" id="posts">
        <section class="publicar">
            <div class="perfil">
                <?php if (!empty($_SESSION['photo_url'])) : ?>
                    <img src="assets/images/<?= $_SESSION['photo_url'] ?>" alt="">
                <?php else : ?>
                    <img src="assets/images/sem-foto.jpg" alt="">
                <?php endif; ?>
                <button class="btnPublicar" type="text" name="" id="btnPublicarHome">Criar nova publicação</button>
            </div>
            <div class="links">
                <a href="#">Foto</a>
                <a href="#">Vídeo</a>
                <a href="#">Evento</a>
            </div>
        </section>
        <hr class="divisaoPost">
    </article>

    <nav class="direita">
        <section>
            <p>
                Maecenas eget eros at lacus lacinia pharetra. Praesent quis nibh fringilla diam fermentum tempor
                id non tortor. Ms purus ligula. Fusce semper ligula dui, suscipit vestibulum leo tristique
                quis. Donec fermentum, est sit amet eleifend lobortis, libero orci fermentum mi, rutrum interdum
                nisl metus a odio.</p>
            <p>
                Suspendisse potenti. Suspendisse pulvinar ultricies accumsan. Vivamus vel ullamcorper magna. Sed
                tempor iaculis purus lutpat. Proin rutrum, arcu sit amet fringilla venenatis, orci dolor
                sagittis urna, in fringilla libero nisl ut nisl.
            </p>
        </section>
        <section>
            <p>
                Maecenas eget eros at lacus lacinia pharetra. Praesent quis nibh fringilla diam fermentum tempor
                id non tortor. Mauris sit amet est eu risus dignissim iaculis. Phasellus vulputate tortor et dui
                fringilla fermentum, est sit amet eleifend lobortis, libero orci fermentum mi, rutrum interdum
                nisl metus a odio.</p>
            <p>
                Suspendisse potenti. Suspendisse pulvinar ultricies accumsan. Vivamus vel ullamcorper magna. Sed
                tempor iaculis purus ut rhoncus. Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames a fringilla libero nisl ut nisl.
            </p>
        </section>
        <section>
            <p>
                Maecenas eget eros at lacus lacinia pharetra. Praesent quis nibh fringilla diam fermentum tempor
                id non tortor. Mauris sit amet est eu risus dignissim iaculis. Phasellus vulputate tortor et dui
                fringilla aliquet. Aenean fermentum viverra urna, vel maximus turpis gravida vitae. Aliquam eget
            </p>
            <p>
                Suspendisse potenti. Suspendisse pulvinar ultricies accumsan. Vivamus vel ullamcorper magna. Sed
                tempor iaculis purus ut rhoncus. Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas.
            </p>
        </section>
    </nav>

</section>