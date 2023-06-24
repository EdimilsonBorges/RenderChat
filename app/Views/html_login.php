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
                <button type="button" id="btnEsqSenha" class="esqSenha">Esqueceu a senha?</button>
                <button type="button" id="btnCadastrar" class="cadastrar">Criar nova conta</button>
            </footer>
            <div class="mensagem">
                <?php if (isset($_SESSION['error'])) : ?>
                    <p><?= $_SESSION['error'] ?></p>
                <?php unset($_SESSION['error']);
                endif; ?>
            </div>
        </section>
    </section>
    <div id="areaCreateAcount" class="areaCreateAcount">
        <div id="linksCreateAcount" class="linksCreateAcount">
            <div class="cabecalhoCreateAcount">
                <h4>Cadastre-se!!!</h4>
                <span id="btnFecharCreateAcount" class="btnFecharCreateAcount"><img src="./assets/icons/close.svg"></span>
            </div>
            <div class="quadro">
                <div class="campoCreateAcount">
                    <div>
                        <input type="text" name="" class="campos" placeholder="Nome">
                        <input type="text" name="" class="campos" placeholder="Sobrenome">
                    </div>
                    <div>
                        <input type="email" class="campos" placeholder="E-mail">
                    </div>
                    <div>
                        <input type="password" class="campos" placeholder="Nova senha">
                        <input type="password" class="campos" placeholder= "Repetir senha">
                    </div>
                    <h3>Data de nascimento</h3>
                    <div>
                        <select class="campos" name="dia">
                            <option value="">01</option>
                            <option value="">02</option>
                            <option value="">03</option>
                            <option value="">04</option>
                            <option value="">05</option>
                            <option value="">06</option>
                            <option value="">07</option>
                            <option value="">08</option>
                            <option value="">09</option>
                            <option value="">10</option>
                            <option value="">11</option>
                            <option value="">12</option>
                            <option value="">13</option>
                            <option value="">14</option>
                            <option value="">15</option>
                            <option value="">16</option>
                            <option value="">17</option>
                            <option value="">18</option>
                            <option value="">19</option>
                            <option value="">20</option>
                            <option value="">21</option>
                            <option value="">22</option>
                            <option value="">23</option>
                            <option value="">24</option>
                            <option value="">25</option>
                            <option value="">26</option>
                            <option value="">27</option>
                            <option value="">28</option>
                            <option value="">29</option>
                            <option value="">30</option>
                            <option value="">31</option>
                        </select>
                        <select class="campos" name="mes">
                            <option value="">Janeiro</option>
                            <option value="">Fevereiro</option>
                            <option value="">Março</option>
                            <option value="">Abril</option>
                            <option value="">Maio</option>
                            <option value="">Junho</option>
                            <option value="">Julho</option>
                            <option value="">Agosto</option>
                            <option value="">Setembro</option>
                            <option value="">Outubro</option>
                            <option value="">Novembro</option>
                            <option value="">Dezembro</option>
                        </select>
                        <select class="campos" name="ano">
                            <option value="">2023</option>
                            <option value="">2022</option>
                            <option value="">2021</option>
                            <option value="">2020</option>
                            <option value="">2019</option>
                            <option value="">2018</option>
                            <option value="">2017</option>
                            <option value="">2016</option>
                            <option value="">2015</option>
                            <option value="">2014</option>
                            <option value="">2013</option>
                            <option value="">2012</option>
                            <option value="">2011</option>
                            <option value="">2010</option>
                            <option value="">2009</option>
                            <option value="">2008</option>
                            <option value="">2007</option>
                            <option value="">2006</option>
                            <option value="">2005</option>
                            <option value="">2004</option>
                            <option value="">2003</option>
                            <option value="">2002</option>
                            <option value="">2001</option>
                            <option value="">2000</option>
                            <option value="">1999</option>
                            <option value="">1998</option>
                            <option value="">1997</option>
                            <option value="">1996</option>
                            <option value="">1995</option>
                            <option value="">1994</option>
                            <option value="">1993</option>
                            <option value="">1992</option>
                            <option value="">1991</option>
                            <option value="">1990</option>
                            <option value="">1989</option>
                            <option value="">1988</option>
                            <option value="">1987</option>
                            <option value="">1986</option>
                            <option value="">1985</option>
                            <option value="">1984</option>
                            <option value="">1983</option>
                            <option value="">1982</option>
                            <option value="">1981</option>
                            <option value="">1980</option>
                        </select>
                    </div>
                    <h3>Gênero</h3>
                    <div>
                        <div>
                            <label for="masculino">Masculino</label>
                            <input class="radio" type="radio" name="genero" id="masculino">
                        </div>
                        <div>
                            <label for="feminino">Feminino</label>
                            <input class="radio" type="radio" name="genero" id="feminino">
                        </div>
                        <div>
                            <label for="outro" >Outro</label>
                            <input class="radio" type="radio" name="genero" id="outro">
                        </div>
                    </div>
                    <div>
                        <input type="text" name="" class="campos" id="camposGenero" placeholder="Gênero">
                    </div>
                    <div>
                        <button type="button">Cadastrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/js/login.js"></script>
</body>
</html>