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
    <title>Tela de login</title>
    <link rel="stylesheet" href="assets/css/login.css">
</head>

<body>
    <section class="areaLogin">
        <img src="./assets/icons/connected-login.svg">
        <section class="caixaLogin">
            <div class="titulo">
                <h1>Olá!</h1>
                <h2>Seja bem-vindo ao RenderChat.</h2>
                <p>Faça seu login agora.</p>
            </div>
            <div class="formulario">
                <form action="index.php" method="POST">
                    <label for="e-mail">E-mail:</label>
                    <input type="email" name="e-mail" id="e-mail" placeholder="Digite seu e-mail" size="30">

                    <label for="senha">Senha:</label>
                    <input type="password" name="senha" id="senha" placeholder="Digite sua senha" size="30">

                    <button type="submit">Entrar</button>
                </form>
            </div>
            <footer class="rodape">
                <button type="button" class="esqSenha">Esqueceu a senha?</button>
                <button type="button" class="cadastrar">Criar nova conta</button>
            </footer>
            <div class="mensagem">
                <?php if (isset($_SESSION['error'])) : ?>
                    <p><?= $_SESSION['error'] ?></p>
                <?php unset($_SESSION['error']);
                endif; ?>
            </div>
        </section>
    </section>

    <!-- <div id="areaCreateAcount" class="areaCreateAcount mostrarJanela"> -->
    <div id="areaCreateAcount" class="areaCreateAcount">
        <div id="linksCreateAcount" class="linksCreateAcount">
            <div class="cabecalhoCreateAcount">
                <h4>Cadastre-se!!!</h4>
                <span id="btnFecharCreateAcount" class="btnFecharCreateAcount"><img src="./assets/icons/close.svg"></span>
            </div>
            <div class="campoCreateAcount">
                <div class = "nome">
                    <label>Nome</label>
                <input type="text" name="" id="" placeholder="Nome">
                <input type="text" name="" id="" placeholder="Sobrenome">
                </div>
                <div class = "data-de-nasc">
                <label>Data de nascimento</label>
                <input type="text" name="" id="" placeholder="dia">
                <input type="text" name="" id="" placeholder="mes">
                <input type="text" name="" id="" placeholder="ano">
                </div>
                <div class = "genero">
                <label>Genero</label>
                <input type="text" name="" id="" placeholder="genero">
                </div>
                <div class = "email">
                <label>Email</label> 
                <input type="text" name="" id="" placeholder="e-mail">
                </div>
                <div class = "senha">
                <label>Senha</label>
                <input type="text" name="" id="" placeholder="senha">
                <input type="text" name="" id="" placeholder="confirmar senha">
                </div>
                
            </div>
        </div>
    </div>

</body>
</html>