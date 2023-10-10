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
    <script src="assets/js/login.js" defer></script>
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
                        <input type="text" id="campoNome" class="campos" placeholder="Nome">
                        <input type="text" id="campoSobrenome" class="campos" placeholder="Sobrenome">
                    </div>
                    <div>
                        <input type="email" id="campoEmail" class="campos" placeholder="E-mail">
                    </div>
                    <div>
                        <input type="password" id="campoNovaSenha" class="campos" placeholder="Nova senha">
                        <input type="password" id="campoRepetirSenha" class="campos" placeholder= "Repetir senha">
                    </div>
                    <h3>Data de nascimento</h3>
                    <div>
                        <select id="campoDia" class="campos" name="dia">
                            <option>01</option>
                            <option>02</option>
                            <option>03</option>
                            <option>04</option>
                            <option>05</option>
                            <option>06</option>
                            <option>07</option>
                            <option>08</option>
                            <option>09</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                            <option>13</option>
                            <option>14</option>
                            <option>15</option>
                            <option>16</option>
                            <option>17</option>
                            <option>18</option>
                            <option>19</option>
                            <option>20</option>
                            <option>21</option>
                            <option>22</option>
                            <option>23</option>
                            <option>24</option>
                            <option>25</option>
                            <option>26</option>
                            <option>27</option>
                            <option>28</option>
                            <option>29</option>
                            <option>30</option>
                            <option>31</option>
                        </select>
                        <select id="campoMes" class="campos" name="mes">
                            <option value="01">Janeiro</option>
                            <option value="02">Fevereiro</option>
                            <option value="03">Março</option>
                            <option value="04">Abril</option>
                            <option value="05">Maio</option>
                            <option value="06">Junho</option>
                            <option value="07">Julho</option>
                            <option value="08">Agosto</option>
                            <option value="09">Setembro</option>
                            <option value="10">Outubro</option>
                            <option value="11">Novembro</option>
                            <option value="12">Dezembro</option>
                        </select>
                        <select id="campoAno" class="campos" name="ano">
                            <option>2023</option>
                            <option>2022</option>
                            <option>2021</option>
                            <option>2020</option>
                            <option>2019</option>
                            <option>2018</option>
                            <option>2017</option>
                            <option>2016</option>
                            <option>2015</option>
                            <option>2014</option>
                            <option>2013</option>
                            <option>2012</option>
                            <option>2011</option>
                            <option>2010</option>
                            <option>2009</option>
                            <option>2008</option>
                            <option>2007</option>
                            <option>2006</option>
                            <option>2005</option>
                            <option>2004</option>
                            <option>2003</option>
                            <option>2002</option>
                            <option>2001</option>
                            <option>2000</option>
                            <option>1999</option>
                            <option>1998</option>
                            <option>1997</option>
                            <option>1996</option>
                            <option>1995</option>
                            <option>1994</option>
                            <option>1993</option>
                            <option>1992</option>
                            <option>1991</option>
                            <option>1990</option>
                            <option>1989</option>
                            <option>1988</option>
                            <option>1987</option>
                            <option>1986</option>
                            <option>1985</option>
                            <option>1984</option>
                            <option>1983</option>
                            <option>1982</option>
                            <option>1981</option>
                            <option>1980</option>
                        </select>
                    </div>
                    <h3>Gênero</h3>
                    <div>
                        <div>
                            <label for="masculino">Masculino</label>
                            <input class="radio" value="M" type="radio" name="genero" id="masculino">
                        </div>
                        <div>
                            <label for="feminino">Feminino</label>
                            <input class="radio" value="F" type="radio" name="genero" id="feminino">
                        </div>
                        <div>
                            <label for="outro" >Outro</label>
                            <input class="radio" value="O" type="radio" name="genero" id="outro">
                        </div>
                    </div>
                    <div>
                        <input type="text" name="" class="campos" id="camposGenero" placeholder="Gênero">
                    </div>
                    <div>
                        <button id="btnSubmit" type="button">Cadastrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>