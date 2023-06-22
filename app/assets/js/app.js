import { FuncoesPosts } from "./funcoesPosts.js";
import { Chat } from "./chat.js";

const userId = document.getElementById("principal").dataset.userid;
const nameC = document.getElementById("principal").dataset.namec;
const photo = document.getElementById("principal").dataset.photo;

let chat = new Chat(userId,nameC,photo)
let funcoesPosts = new FuncoesPosts(userId,nameC,photo);

chat.connect();


// Funções da página =====================================================================================

// ocultar menu se clicar fora do elemento
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

// mostra o menu da conta
const navLinkConta = document.getElementById("navLinkConta");
const conta = document.getElementById("conta");
conta.addEventListener("click", () => {
    navLinkConta.classList.toggle("visivel");
});


// const menuHome = document.getElementById("menuHome");
// const menuPerfil = document.getElementById("menuPerfil");
// const menuFriends = document.getElementById("menuFriends");
// const menuConvites = document.getElementById("menuConvites");
// const menuMesseger = document.getElementById("menuMesseger");
// const menuNotifly = document.getElementById("menuNotifly");
// const menuConfig = document.getElementById("menuConfig");

//  menuHome.addEventListener("click", ()=>{
//     menuHome.classList.add("active");
//     console.log(menuHome);
//  });

// menuPerfil.onclick = () => {
//     menuPerfil.classList.add("active");
// }
// menuFriends.onclick = () => {
//     menuFriends.classList.add("active");
// }
// menuConvites.onclick = () => {
//     menuConvites.classList.add("active");
// }
// menuMesseger.onclick = () => {
//     menuMesseger.classList.add("active");
// }
// menuNotifly.onclick = () => {
//     menuNotifly.classList.add("active");
// }
// menuConfig.onclick = () => {
//     menuConfig.classList.add("active");
// }

// carrega os posts
funcoesPosts.getAllPosts();

if (!funcoesPosts.fim) {
    window.addEventListener('scroll', () => {

        const elemento = document.getElementsByClassName("publication")[funcoesPosts.postPosition];
        if (elemento != null) {
            let rect = elemento.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                if (!funcoesPosts.carregando) {
                    funcoesPosts.offset += funcoesPosts.limit;
                    console.log("Carregando....");
                    funcoesPosts.getAllPosts();
                } else {
                    console.log("Carregou!!!");
                }
            }
        }
    });
}

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

// Publicar um Post (Página Home)
const btnPublicarHome = document.getElementById("btnPublicarHome");
if (btnPublicarHome) {
    btnPublicarHome.addEventListener("click", () => {
        funcoesPosts.postModal();
    });
} else {
    // Publicar um Post (Página Perfil)
    const btnPublicarPerfil = document.getElementById("btnPublicarPerfil");
    btnPublicarPerfil.addEventListener("click", () => {
        funcoesPosts.postModal();
    });
}

document.getElementById("cabecalhoBatePapoPrincipal").onclick = function () {

    ocultarDesocultarBatePapo();
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