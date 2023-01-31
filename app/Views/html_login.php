<?php
defined("ROOT") or die("Acesso negado");
 
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tela de login</title>
    <link rel="stylesheet" href="assets/css/login.css">
</head>

<body>
    <section class="caixa">
        <div class="titulo">
            <h1>Seja Bem-vindo!</h1>
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
            <a href="#">Esqueceu a senha?</a>
            <button class="cadastrar">Criar nova conta</button>
        </footer>
        <div class="mensagem">
            <?php if (isset($_SESSION['error'])) : ?>
                <p><?= $_SESSION['error'] ?></p>
            <?php unset($_SESSION['error']);
            endif; ?>
        </div>
    </section>
</body>
</html>