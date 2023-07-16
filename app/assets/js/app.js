import { FuncoesPosts } from "./funcoesPosts.js";
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

if(!pagina){
    pagina = "home";
}

let chat = new Chat(userId, nameC, photo)
let funcoesPosts = new FuncoesPosts(userId, nameC, photo, pagina);


if (pagina === "perfil") {
    new FuncoesPerfil();
    funcoesPosts.getAllPosts(); //carrega os posts
    chat.connect(); // abrir chat
} else if (pagina === "home") {
    new FuncoesLinhaDoTempo();
    funcoesPosts.getAllPosts(); //carrega os posts
    chat.connect(); // abrir chat
} else if (pagina === "friends") {
    new FuncoesFriends(userId);
    chat.connect(); // abrir chat
}else if(pagina === "messeger"){
     new FuncoesMesseger(userId, nameC, photo);
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

if(document.getElementById("cabecalhoBatePapoPrincipal")){
    document.getElementById("cabecalhoBatePapoPrincipal").onclick = function () {

        ocultarDesocultarBatePapo();
    }
}


function ocultarDesocultarBatePapo() {

    const batepapo = document.getElementById("batePapo");

    if (batepapo.style.height == "75vh") {
        batepapo.style.height = "57px";
    } else if (batepapo.style.height < "60px") {
        batepapo.style.height = "75vh";
    }
}
// =======================================================================================================