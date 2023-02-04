<?php
defined("ROOT") or die("Acesso negado");
?>

<section class="container-corpo">
    <nav class="direita">
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
    
    <article class="posts">
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
        <hr>
        <?php

            $variables = [
                'user_id' => $_SESSION['user_id'],
            ];
            $posts = api_request('get_all_posts', 'GET', $variables);

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

                <section class="publication">
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
                        <button id="<?= $post['user_id'] ?>" class="btnPostMenuDrop">...</button>
                        <nav class="navLinks">
                            <div class="linksPostMenuDrop">
                                <a onclick="editModal('<?= $post['id'] ?>', <?= $i ?>, 'home')">Editar</a>
                                <a href="Controllers/delete_post.php?id=<?= $post['id'] ?>&r=home">Excluir</a>
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
                            <p id="comment" class="comment" onclick="mostrar(<?= $i ?>)"><?= $comments ?></p><span onclick="verComment('<?= $post['id'] ?>','<?= $post['user_id'] ?>',<?= $i ?>)"> Comentários</span>
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
                        <button type="button" onclick="verComment('<?= $post['id'] ?>','<?= $post['user_id'] ?>',<?= $i ?>)">Comentar</button>
                        <button type="button" onclick="share('<?= $post['id'] ?>', <?= $i ?>, 'home')">Compartilhar</button>
                    </div>
                    <div class="commentArea">
                        <div class="commentar">
                            <textarea class="txtTextAreaComment" name="" id="txtTextAreaComment" onkeyup="autoResize(this)" placeholder="Escreva um comentário"></textarea>
                            <button type="button" onclick="comment('<?= $_SESSION['user_id'] ?>','<?= $post['id'] ?>','<?= $post['user_id'] ?>', <?= $i ?>)">Enviar</button>
                        </div>
                        <div class="area">

                        </div>
                    </div>
                </section>
            <?php endforeach; ?>
    </article>




    <nav class="esquerda">
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