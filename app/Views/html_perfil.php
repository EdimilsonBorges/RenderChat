<?php
defined("ROOT") or die("Acesso negado");
?>

<section class="container-cabecalho-p">
    <article class="cabecalho-p">
        <section class="capa">
            <section class="imagem-capa">
                <img src="assets/images/capa.jpg" alt="">
                <div class="sobreposicao-capa">
                    <p>Mudar imagem da capa</p>
                </div>
            </section>
        </section>
        <section class="perfil-p">
            <section class="imagem-perfil">
                <?php if (!empty($_SESSION["photo_url"])) : ?>
                    <img src="assets/images/<?= $_SESSION["photo_url"] ?>" alt="">
                <?php else : ?>
                    <img src="assets/images/sem-foto.jpg" alt="">
                <?php endif; ?>
                <div class="sobreposicao-perfil">
                    <p>Mudar foto</p>
                </div>
            </section>
            <div class="descricao">
                <h1><?= $_SESSION['first_name'] . " " . $_SESSION['last_name'] ?></h1>
                <h2>569 Amigos</h2>
            </div>
        </section>
    </article>
    <article class="container-corpo-p">
        <section class="container-lateral-p">
            <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget enim vitae quam pulvinar
                    faucibus ac eget odio. Aliquam viverra turpis a dapibus bibendum. Phasellus vitae neque vitae
                    mauris ornare volutpat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus. Praesent rhoncus metus eu dictum pellentesque. Suspendisse lacinia iaculis lorem
                    ut scelerisque. Sed in augue sed mi rhoncus porta. Pellentesque pharetra sed arcu eget cursus.
                    Sed et diam sem. Integer ultrices a arcu at consequat. Pellentesque lacinia risus nisi, at
                    pretium erat vehicula sed.</p>
            </div>
            <div>
                <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc
                    non eleifend mi. Donec suscipit nulla congue hendrerit facilisis. Suspendisse potenti. Aliquam
                    tempor ex vel tristique pharetra. Nunc commodo lectus dolor, vel vulputate est commodo nec.
                    Vestibulum a augue finibus, efficitur turpis et, dignissim justo. Vestibulum sed urna at metus
                    gravida blandit. Curabitur ac molestie justo, quis rutrum nulla. Vivamus lacinia risus at lectus
                    aliquet, nec luctus orci volutpat. Nam imperdiet pharetra nisi, ac commodo dui.</p>
            </div>
            <div>
                <p>Etiam quis lorem ut justo tincidunt finibus et nec dolor. Nam vitae pharetra risus, sed mattis
                    dui. Maecenas in accumsan lorem, eu pharetra nisi. Nunc sollicitudin eget est at porttitor. Sed
                    posuere, metus ac efficitur imperdiet, ex eros pulvinar magna, sit amet aliquet felis lorem at
                    diam. Cras laoreet enim dictum feugiat pulvinar. Aliquam consectetur volutpat facilisis. Ut ut
                    est et justo molestie rutrum. Nulla condimentum egestas nunc, nec cursus purus semper placerat.
                    Praesent bibendum leo nibh, non tincidunt nunc suscipit sed. Maecenas imperdiet, tellus eu
                    rhoncus tincidunt, dui mauris mattis magna, ut faucibus sem dolor ut lectus. Nam mollis tempus
                    tortor.</p>
            </div>
        </section>

        <article class="posts-p">
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
            <hr>

            <?php

            $variables = [
                'user_id' => $_SESSION['user_id'],
            ];
            $posts = api_request('get_post_user', 'GET', $variables);

            $i = -1;
            foreach ($posts['results'] as $post) :

                $i++;
                $variables = [
                    'post_id' => $post['id'],
                ];
                $totals = api_request('totals', 'GET', $variables);

                $likes = $totals['results']['0']['totals'];
                $comments = $totals['results']['1']['totals'];
                $shares = $totals['results']['2']['totals'];

                $datas_post = $post['created_at'];

                date_default_timezone_set('America/Sao_Paulo');
                //date_default_timezone_set('America/Los_Angeles');

                $time_post = new DateTime($datas_post);
                $agora = new DateTime();

                $intervalo_post = $time_post->diff($agora);
            ?>
                <section class="publication" data-postid = <?= $post['id'] ?> data-postuserid=<?= $post['user_id'] ?>>
                    <?php
                    if (!empty($post['sh_user_id'])) : ?>
                        <header class="perfilshare">
                            <div>
                                <?php if (!empty($post['sh_photo_url'])) : ?>
                                    <img src="assets/images/<?= $post['sh_photo_url'] ?>" alt="">
                                <?php else : ?>
                                    <img src="assets/images/sem-foto.jpg" alt="">
                                <?php endif; ?>
                                <p><?php echo ($post['sh_first_name'] . " " . $post['sh_last_name']) ?> compartilhou isso!</p>
                            </div>
                            <?php if (!empty($post['sh_comment'])) : ?>
                                <p class="shareComment"><?= $post['sh_comment'] ?></p>
                            <?php endif; ?>
                        </header>
                    <?php
                    elseif (!empty($post['lik_user_id'])) : ?>
                        <header class="perfil_like">
                            <div>
                                <?php if (!empty($post['lik_photo_url'])) : ?>
                                    <img src="assets/images/<?= $post['lik_photo_url'] ?>" alt="">
                                <?php else : ?>
                                    <img src="assets/images/sem-foto.jpg" alt="">
                                <?php endif;
                                if ($likes <= 1) : ?>
                                    <p><?php echo ($post['lik_first_name'] . " " . $post['lik_last_name']) ?> curtiu isso!</p>
                                <?php else : ?>
                                    <p><?php echo ($post['lik_first_name'] . " " . $post['lik_last_name']) ?> e outras <?= $likes - 1 ?> pessoas curtiu isso!</p>
                                <?php endif; ?>
                            </div>
                            <p></p>
                        </header>
                    <?php
                    endif;
                    ?>
                    <div class="postMenuDrop">
                        <button class="btnPostMenuDrop">...</button>
                        <nav class="navLinks">
                            <div class="linksPostMenuDrop">
                                <a>Editar</a>
                                <a href="Controllers/delete_post.php?id=<?= $post['id'] ?>&r=perfil">Excluir</a>
                            </div>
                        </nav>
                    </div>
                    <div class="publicationPost">
                        <header class="perfil">
                            <div>
                                <?php if (!empty($post['photo_url'])) : ?>
                                    <img src="assets/images/<?= $post['photo_url'] ?>" alt="">
                                <?php else : ?>
                                    <img src="assets/images/sem-foto.jpg" alt="">
                                <?php endif; ?>
                            </div>
                            <div class="cabecalho">
                                <div class="postCabecalho">
                                    <h3> <?= $post['first_name'] . ' ' . $post['last_name'] ?></h3>
                                </div>
                                <?php
                                if ($intervalo_post->y > 0) :
                                    if ($intervalo_post->y > 1) : ?>
                                        <h5><?= $intervalo_post->y . " Anos atrás" ?></h5>
                                    <?php else : ?>
                                        <h5><?= $intervalo_post->y . " Ano atrás" ?></h5>
                                    <?php endif;
                                elseif ($intervalo_post->m > 0) :
                                    if ($intervalo_post->m > 1) : ?>
                                        <h5><?= $intervalo_post->m . " Meses atrás" ?></h5>
                                    <?php else : ?>
                                        <h5><?= $intervalo_post->m . " Mês atrás" ?></h5>
                                    <?php endif;
                                elseif ($intervalo_post->d > 0) :
                                    if ($intervalo_post->d > 1) : ?>
                                        <h5><?= $intervalo_post->d . " Dias atrás" ?></h5>
                                    <?php else : ?>
                                        <h5><?= $intervalo_post->d . " Dia atrás" ?></h5>
                                    <?php endif;
                                elseif ($intervalo_post->h > 0) :
                                    if ($intervalo_post->h > 1) : ?>
                                        <h5><?= $intervalo_post->h . " Horas atrás" ?></h5>
                                    <?php else : ?>
                                        <h5><?= $intervalo_post->h . " Hora atrás" ?></h5>
                                    <?php endif;
                                elseif ($intervalo_post->i > 0) :
                                    if ($intervalo_post->i > 1) : ?>
                                        <h5><?= $intervalo_post->i . " Minutos atrás" ?></h5>
                                    <?php else : ?>
                                        <h5><?= $intervalo_post->i . " Minuto atrás" ?></h5>
                                    <?php endif;
                                elseif ($intervalo_post->s > 0) : ?>
                                    <h5><?= $intervalo_post->s . " Segundos atrás" ?></h5>
                                <?php else : ?>
                                    <h5>Agora mesmo</h5>
                                <?php endif; ?>
                            </div>
                        </header>
                        <div>
                            <?php if (!empty($post['post'])) : ?>
                                <p id="post" class="post"> <?= $post['post'] ?></p>
                            <?php endif;
                            if (!empty($post['foto_url'])) : ?>
                                <img src="assets/images/<?= $post['foto_url'] ?>" alt="">
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="curtidas-comentarios">
                        <div class="curtidas">
                            <?php if ($likes > 1) : ?>
                                <p class="like" onclick="mostrarCurtidas('<?= $post['id'] ?>')"> <?= $likes ?></p><span onclick="mostrarCurtidas('<?= $post['id'] ?>')"> Curtidas</span>
                            <?php else : ?>
                                <p class="like" onclick="mostrarCurtidas('<?= $post['id'] ?>')"> <?= $likes ?></p><span onclick="mostrarCurtidas('<?= $post['id'] ?>')"> Curtida</span>
                            <?php endif; ?>
                        </div>
                        <div class="comentarios">
                            <p class="spanComment"><?= $comments ?></p><span> Comentários</span>
                        </div>
                        <div class="compartilhamentos">
                            <?php if ($shares > 1) : ?>
                                <p class="share" onclick="mostrarCompartilhamentos('<?= $post['id'] ?>')"><?= $shares ?></p><span onclick="mostrarCompartilhamentos('<?= $post['id'] ?>')"> Compartilhamentos</span>
                            <?php else : ?>
                                <p class="share" onclick="mostrarCompartilhamentos('<?= $post['id'] ?>')"><?= $shares ?></p><span onclick="mostrarCompartilhamentos('<?= $post['id'] ?>')"> Compartilhamento</span>
                            <?php endif; ?>
                        </div>
                    </div>
                    <hr>
                    <div class="botoes-publication">
                        <?php if (empty($post['li_post_id'])) : ?>
                            <button type="button" onclick="like('<?= $post['id'] ?>','<?= $_SESSION['user_id'] ?>', this, <?= $i ?>)">Curtir</button>
                        <?php else : ?>
                            <button type="button" onclick="like('<?= $post['id'] ?>','<?= $_SESSION['user_id'] ?>', this, <?= $i ?>)">Descurtir</button>
                        <?php endif; ?>
                        <button class="btnComment" type="button">Comentar</button>
                        <button type="button" onclick="share('<?= $post['id'] ?>', <?= $i ?>, 'perfil')">Compartilhar</button>
                    </div>
                    <div class="commentArea">
                        <div class="commentar">
                            <textarea class="txtTextAreaComment" name="" id="txtTextAreaComment" onkeyup="autoResize(this)" placeholder="Escreva um comentário"></textarea>
                            <button class="btnEnviarComment" type="button">Enviar</button>
                        </div>
                        <div class="area">

                        </div>
                    </div>
                </section>
            <?php endforeach; ?>
        </article>

    </article>
</section>

</section>