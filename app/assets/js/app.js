"use strict";

import { FuncoesPosts } from "./funcoesPosts.js";
import { ConnectChat } from "./connectChat";
import { Chat } from "./chat.js";
import { FuncoesPerfil } from "./funcoesPerfil.js";
import { FuncoesLinhaDoTempo } from "./funcoesLinhaDoTempo.js";
import { FuncoesFriends } from "./funcoesFriends.js";
import { FuncoesMesseger } from "./funcoesMesseger.js";

const userId = document.getElementById("principal").dataset.userid;
const nameC = document.getElementById("principal").dataset.namec;
const photo = document.getElementById("principal").dataset.photo;

const urlAtual = window.location.href;
const urlClass = new URL(urlAtual);
let pagina = urlClass.searchParams.get("r");
const connection = new ConnectChat(userId);

if(!pagina){
    pagina = "home";
}

let funcoesPosts = new FuncoesPosts(userId, nameC, photo, pagina);

if (pagina === "perfil") {
    new Chat(userId, nameC, photo, connection);
    new FuncoesPerfil(userId);
    funcoesPosts.getAllPosts(); //carrega os posts
} else if (pagina === "home") {
    new Chat(userId, nameC, photo, connection);
    new FuncoesLinhaDoTempo();
    funcoesPosts.getAllPosts(); //carrega os posts
} else if (pagina === "friends") {
    new Chat(userId, nameC, photo, connection);
    new FuncoesFriends(userId);
}else if(pagina === "messeger"){
     new FuncoesMesseger(userId, nameC, photo, connection);
}

//Publicar um Post (Página Home)
const btnPublicarHome = document.getElementById("btnPublicarHome");
const btnPublicarPerfil = document.getElementById("btnPublicarPerfil");

if (btnPublicarHome) {
    btnPublicarHome.addEventListener("click", () => {
        funcoesPosts.postModal();
    });
} else if (btnPublicarPerfil) {
    // Publicar um Post (Página Perfil)
    btnPublicarPerfil.addEventListener("click", () => {
        funcoesPosts.postModal();
    });
}

// ocultar menu se clicar fora do elemento
window.onclick = function (event) {
    if (!event.target.matches('.btnCommentMenuDrop')) {

        for (let i = 0; i < janelas.length; i++) {
            let aberto = janelas[i];
            if (aberto.classList.contains("navLinksCommentVisible")) {
                aberto.classList.remove("navLinksCommentVisible");
                aberto.classList.add("navLinksCommentInvisible");
            }
        }

    }
}




// Funções da página =====================================================================================

// ocultar menu se clicar fora do elemento
const ocultarElementos = () => {
    window.onclick = function (event) {
        if (!event.target.matches('.btnPostMenuDrop') && !event.target.matches('.conta img') && !event.target.matches('.conta span') && !event.target.matches('.conta')) {
            const elements = document.querySelectorAll(".linksPostMenuDrop, .navLinkConta");

            for (let i = 0; i < elements.length; i++) {
                let aberto = elements[i];
                if (aberto.classList.contains("visivel")) {
                    aberto.classList.remove("visivel");
                }
            }
        }
    }
}

ocultarElementos();


// mostra o menu da conta
const navLinkConta = document.getElementById("navLinkConta");
const conta = document.getElementById("conta");
conta.addEventListener("click", () => {
    navLinkConta.classList.toggle("visivel");
    console.log("clicou");
});


function showHint(str) {
    if (str.length == 0) {
        document.getElementById("txtHint").innerHTML = "";
        return;
    } else {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function () {
            document.getElementById("txtHint").innerHTML = this.responseText;
        }
        xmlhttp.open("GET", `../api/pesq_users/index.php?q=${str}`, true);
        xmlhttp.send();
    }
}

// =======================================================================================================