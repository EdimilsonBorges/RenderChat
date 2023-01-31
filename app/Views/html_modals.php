<?php
defined("ROOT") or die("Acesso negado");
?>

<div id="areaPostModal" class="areaPostModal esconderPostModal">

        <div id="postModal" class="postModal">
            <div class="cabecalhoPostModal">
                <h4></h4>
                <span id="btnFecharPostModal" class="btnFecharPostModal">x</span>
            </div>
            <hr>
            <div class="perfilPostModal">
                <?php if (!empty($_SESSION['photo_url'])) : ?>
                    <img src="assets/images/<?= $_SESSION['photo_url'] ?>" alt="">
                <?php else : ?>
                    <img src="assets/images/sem-foto.jpg" alt="">
                <?php endif; ?>
                <h5><?= $_SESSION['first_name'] ?> <?= $_SESSION['last_name'] ?></h5>
            </div>
            <form id="postForm" action="" method="GET">
                <textarea name="post" class="textAreaPostModal" rows="500" placeholder="No que você está pensando?"></textarea>
                <input id="rpost" type="hidden" name="r" value="">
                <input type="hidden" name="user_id" value="<?= $_SESSION['user_id'] ?>">
                <input id="postId" type="hidden" name="id">
                <input type="hidden" name="foto_url" value="">
                <input type="hidden" name="video_url" value="">
                <button type="submit"></button>
            </form>
        </div>
    </div>

    <div id="areaCompartModal" class="areaCompartModal esconderPostModal">

        <div id="compartModal" class="compartModal">
            <div class="cabecalhoCompartModal">
                <h4>Compartilhamento</h4>
                <span id="btnFecharCompartModal" class="btnFecharCompartModal">x</span>
            </div>
            <hr>
            <div class="perfilCompartModal">
                <?php if (!empty($_SESSION['photo_url'])) : ?>
                    <img src="assets/images/<?= $_SESSION['photo_url'] ?>" alt="">
                <?php else : ?>
                    <img src="assets/images/sem-foto.jpg" alt="">
                <?php endif; ?>
                <h5><?= $_SESSION['first_name'] ?> <?= $_SESSION['last_name'] ?></h5>
            </div>
            <form id="compartForm" action="Controllers/share_post.php" method="GET">
                <input type="hidden" name="user_id" value="<?= $_SESSION['user_id'] ?>">
                <input id="rshare" type="hidden" name="r">
                <input id="postIdCompart" type="hidden" name="post_id">
                <textarea name="comment" class="textAreaCompartModal" rows="500" placeholder="No que você está pensando?"></textarea>
            </form>
            <div id="compartPost" class="compartPost">
                <div id="conteudoPost" class="conteudoPost">
                </div>
            </div>
            <button form="compartForm" type="submit">Compartilhar</button>
        </div>
    </div>

    <div id="arealinksCurtidas" class="arealinksCurtidas esconderPostModal">
        <div id="linksCurtidas" class="linksCurtidas">
            <div class="cabecalhoCurtidas">
                <h4>Curtidas</h4>
                <span id="btnFecharCurtidas" class="btnFecharCurtidas">x</span>
            </div>
            <div class="totalCurtidas">
                <h5>Todas </h5><span></span>
            </div>
            <hr>
            <div class="campoCurtidas">
            </div>
        </div>
    </div>
    <div id="arealinksComp" class="arealinksComp esconderPostModal">
        <div id="linksComp" class="linksComp">
            <div class="cabecalhoComp">
                <h4>Compartilhamentos</h4>
                <span id="btnFecharComp" class="btnFecharComp">x</span>
            </div>
            <div class="totalComp">
                <h5>Todas </h5><span></span>
            </div>
            <hr>
            <div class="campoComp">
            </div>
        </div>
    </div>
    </div>