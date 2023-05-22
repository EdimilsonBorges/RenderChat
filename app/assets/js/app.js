// Conexão do chat =====================================================================================
let conn = new WebSocket('ws:localhost:8080/wss');
//let conn = new WebSocket('ws:192.168.0.103:8080/wss');
let userId = document.getElementById("userId").value;
let nameC = document.getElementById("nameC").value;
let photo = document.getElementById("photo").value;
let onlines;

conn.onopen = function (e) {
    console.log("Connection established!");

    let msg = { // cria um objeto msg
        'userId': userId
    }
    msg = JSON.stringify(msg); //converte para json
    conn.send(msg);
};

conn.onclose = function (e) {
    console.log("Connection fechada!");
};

conn.onmessage = function (e) {

    let data = JSON.parse(e.data);

    if (data.message == null) {
        if (data.read_at == null) {
            onlines = JSON.stringify(data);
            carregarUserChat();
        } else {
           // let dados = JSON.stringify(data);
           // showChatMessage(dados, "me", userId);
           // console.log(dados);
        }
    } else if (data.userId != userId) {
        let dados = JSON.stringify(data);
        showChatMessage(dados, "other", userId);
    } else {
        let dados = JSON.stringify(data);
        showChatMessage(dados, "me", userId);
    }
};

// Funções da página =====================================================================================

let spanComment = [...document.getElementsByClassName('comentarios')];
let btnComment = [...document.getElementsByClassName('btnComment')];

btnComment.map((el) => {
    commentar(el);
});

spanComment.map((el) => {
    commentar(el);
});

function commentar(el) {
    el.addEventListener("click", () => {
        let janela = el.parentNode.parentNode.lastElementChild;
        let postId = el.parentNode.parentNode.dataset.postid;
        let campo = el.parentNode.parentNode.lastElementChild.lastElementChild;
        let spanComment = el.parentNode.parentNode.children[2].children[1].firstElementChild;

        janela.classList.toggle("most");

        let pedidos = new XMLHttpRequest();

        pedidos.open("GET", `Controllers/get_comments?post_id=${postId}`);
        pedidos.send();

        pedidos.onloadend = function () {
            results = JSON.parse(this.response);
            campo.innerHTML = "";
            results['results'].forEach((result) => {
                createComment(postId, result, campo, spanComment);
            });
        }
    });
}

function createComment(postId, result, campo, spanComment) {
    let commentUserId = result['user_id'];
    let commentId = result['id'];

    let perfilComment = document.createElement("header");
    perfilComment.setAttribute("class", "perfil_comment");

    let div = document.createElement("div");

    let img = document.createElement("img");
    if (result['co_photo_url'] != null) {
        img.src = `assets/images/${result['co_photo_url']}`;
    } else {
        img.src = "assets/images/sem-foto.jpg";
    }

    let ccommentMenuDrop = document.createElement("div");
    ccommentMenuDrop.setAttribute("class", "commentMenuDrop");

    let btnCommentMenuDrop = document.createElement("button");
    btnCommentMenuDrop.setAttribute("class", "btnCommentMenuDrop");
    btnCommentMenuDrop.id = "btnCommentMenuDrop";
    btnCommentMenuDrop.innerText = "...";
    btnCommentMenuDrop.onclick = function () {
        commentMenuDrop(commentId, commentUserId, userId);
    }

    let navLinksComment = document.createElement("nav");
    navLinksComment.setAttribute("class", "navLinksComment navLinksCommentInvisible");
    navLinksComment.id = commentId;

    let linksCommentMenuDrop = document.createElement("div");
    linksCommentMenuDrop.setAttribute("class", "linksCommentMenuDrop");

    let delet = document.createElement("a");
    delet.id = "delet";
    delet.innerText = "Excluir";
    delet.onclick = function () {
        deletComment(commentId, postId, campo, spanComment);
    }

    let corpoComment = document.createElement("div");
    corpoComment.setAttribute("class", "corpo_comment");

    let nomePerf = document.createElement("p");
    nomePerf.setAttribute("class", "nomePerf");
    nomePerf.innerText = `${result['co_first_name']} ${result['co_last_name']}`;

    let p = document.createElement("p");
    p.innerHTML = result['comment'];

    div.appendChild(img);
    perfilComment.appendChild(div);

    linksCommentMenuDrop.appendChild(delet);
    navLinksComment.appendChild(linksCommentMenuDrop);
    ccommentMenuDrop.appendChild(btnCommentMenuDrop);
    ccommentMenuDrop.appendChild(navLinksComment);

    corpoComment.appendChild(nomePerf);
    corpoComment.appendChild(p);

    campo.appendChild(perfilComment);
    campo.appendChild(ccommentMenuDrop);
    campo.appendChild(corpoComment);
}

function deletComment(commentId, postId, campo, spanComment) {

    let pedidos = new XMLHttpRequest();

    pedidos.open("GET", `Controllers/delete_comment?id=${commentId}&post_id=${postId}`);
    pedidos.send();

    pedidos.onloadend = function () {

        results = JSON.parse(this.response);
        spanComment.innerHTML--;
        campo.innerHTML = "";
        results['results'].forEach((result) => {
            createComment(postId, result, campo, spanComment);
        });
    }
}

function commentMenuDrop(commentId, commentUser, user) {

    let janela = document.getElementById(commentId);
    let janelas = document.getElementsByClassName("navLinksComment");

    if (user == commentUser) {
        if (janela.classList.contains("navLinksCommentInvisible")) {
            janela.classList.remove("navLinksCommentInvisible");
            janela.classList.add("navLinksCommentVisible");
        } else {
            janela.classList.remove("navLinksCommentVisible");
            janela.classList.add("navLinksCommentInvisible");
        }
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

}
function autoResize(element) {
    textArea = element;
    textArea.addEventListener("keyup", e => {
        textArea.style.height = "1px";
        let scHeight = e.target.scrollHeight;
        textArea.style.height = `${scHeight}px`;
    });
}

function postModal(pagina) {

    const janela = document.getElementById("areaPostModal");
    const btnFechar = document.getElementById("btnFecharPostModal");

    document.querySelector('.postModal .cabecalhoPostModal h4').innerText = "Criar nova publicação";
    document.querySelector("#postForm button").innerHTML = "Publicar";
    document.querySelector("#postForm").action = "Controllers/postar.php";
    document.getElementById("rpost").value = pagina;

    janela.classList.remove("esconderPostModal");
    janela.classList.add("mostrarPostModal");

    btnFechar.onclick = function () {
        document.querySelector("#postForm textarea").value = "";
        janela.classList.remove("mostrarPostModal");
        janela.classList.add("esconderPostModal");
    }
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
let btnPublicarHome = document.getElementById("btnPublicarHome");
if (btnPublicarHome != null) {
    btnPublicarHome.addEventListener("click", () => {
        postModal("home");
    });
} else {
    // Publicar um Post (Página Perfil)
    let btnPublicarPerfil = document.getElementById("btnPublicarPerfil");
    btnPublicarPerfil.addEventListener("click", () => {
        postModal("perfil");
    });
}

// exibir e ocultar o Drop menu do post
let btnPostMenuDrop = [...document.getElementsByClassName("btnPostMenuDrop")];

btnPostMenuDrop.map((el) => {
    el.addEventListener("click", () => {
        let item = el.parentElement.children[1].firstElementChild;
        let postUserId = el.parentElement.parentElement.dataset.postuserid;

        if (userId == postUserId) {
            item.classList.toggle("visivel");
        }

        // ocultar menu se clicar fora do elemento
        window.onclick = function (event) {
            if (!event.target.matches('.btnPostMenuDrop')) {
                let elements = document.getElementsByClassName("linksPostMenuDrop");

                for (let i = 0; i < elements.length; i++) {
                    let aberto = elements[i];
                    if (aberto.classList.contains("visivel")) {
                        aberto.classList.remove("visivel");
                    }
                }
            }
        }
    });
});

// editar publicação
const linksPostMenuDrop = [...document.getElementsByClassName("linksPostMenuDrop")];
linksPostMenuDrop.map((el) => {
    let edit = el.firstElementChild;
    edit.addEventListener("click", () => {

        let post;
        let perfilshare = el.parentElement.parentElement.parentElement.firstElementChild;
        let perfil_like = el.parentElement.parentElement.parentElement.firstElementChild;

        if (perfilshare.classList.contains("perfilshare") || perfil_like.classList.contains("perfil_like")) {
            post = el.parentElement.parentElement.parentElement.children[2].lastElementChild.firstElementChild;
        } else {
            post = el.parentElement.parentElement.parentElement.children[1].lastElementChild.firstElementChild;
        }

        const janela = document.getElementById("areaPostModal");
        const btnFecharPostModal = document.getElementById("btnFecharPostModal");
        const postId = el.parentElement.parentElement.parentElement.dataset.postid;

        document.querySelector('.postModal .cabecalhoPostModal h4').innerText = "Editar publicação";
        document.querySelector("#postForm button").innerHTML = "Salvar";
        document.querySelector("#postForm").action = "Controllers/postUpdate.php";
        document.getElementById("postId").value = postId;
        document.querySelector("#postForm textarea").value = post.innerText;

        janela.classList.remove("esconderPostModal");
        janela.classList.add("mostrarPostModal");

        btnFecharPostModal.onclick = function () {
            document.querySelector("#postForm textarea").value = "";
            janela.classList.remove("mostrarPostModal");
            janela.classList.add("esconderPostModal");
        }
    });
});

// mostrar curtidas
const likesViews = [...document.getElementsByClassName("curtidas")];
likesViews.map((el) => {

    el.addEventListener("click", (e) => {
        const postId = el.parentElement.parentElement.dataset.postid;

        const janela = document.getElementById("arealinksCurtidas");
        const btnFechar = document.getElementById("btnFecharCurtidas");

        const totalLikes = document.querySelector(".totalCurtidas span");
        const campo = document.querySelector(".campoCurtidas");

        campo.innerHTML = "";

        let pedidos = new XMLHttpRequest();

        pedidos.open("GET", `Controllers/get_all_likes/index.php?post_id=${postId}`);
        pedidos.send();

        janela.classList.remove("esconderPostModal");
        janela.classList.add("mostrarPostModal");

        pedidos.onloadend = function () {

            likes = JSON.parse(this.response);

            totalLikes.innerText = likes['results'].length;

            likes['results'].forEach((like) => {

                let perfilCurtidas = document.createElement("div");
                perfilCurtidas.setAttribute("class", "perfilCurtidas");

                let img = document.createElement("img");

                if (like['photo_url'] != null) {
                    img.src = `assets/images/${like['photo_url']}`;
                } else {
                    img.src = "assets/images/sem-foto.jpg";
                }

                let h5 = document.createElement("h5");
                h5.innerText = `${like['first_name']} ${like['last_name']}`;

                let btnAdicionar = document.createElement("button");
                btnAdicionar.type = "button";
                btnAdicionar.innerText = "Adicionar";

                let hr = document.createElement("hr");

                perfilCurtidas.appendChild(img);
                perfilCurtidas.appendChild(h5);
                perfilCurtidas.appendChild(btnAdicionar);

                campo.appendChild(perfilCurtidas);
                campo.appendChild(hr);
            });
        }

        btnFechar.onclick = function () {
            campo.innerHTML = "";
            janela.classList.remove("mostrarPostModal");
            janela.classList.add("esconderPostModal");
        }
    });
});

// mostar compartilhamentos
const compartView = [...document.getElementsByClassName("compartilhamentos")];
compartView.map((el) => {

    el.addEventListener("click", (e) => {
        const postId = el.parentElement.parentElement.dataset.postid;

        const janela = document.getElementById("arealinksComp");
        const btnFechar = document.getElementById("btnFecharComp");

        const totalShares = document.querySelector(".totalComp span");
        const campo = document.querySelector(".campoComp");
        const imagem = document.querySelector(".campoComp .perfilComp img");

        campo.innerHTML = "";

        let pedidos = new XMLHttpRequest();

        pedidos.open("GET", `Controllers/get_all_shares/index.php?post_id=${postId}`);
        pedidos.send();

        janela.classList.remove("esconderPostModal");
        janela.classList.add("mostrarPostModal");

        pedidos.onloadend = function () {

            shares = JSON.parse(this.response);

            totalShares.innerText = shares['results'].length;

            shares['results'].forEach((share) => {

                let perfilComp = document.createElement("div");
                perfilComp.setAttribute("class", "perfilComp");

                let img = document.createElement("img");

                if (share['photo_url'] != null) {
                    img.src = `assets/images/${share['photo_url']}`;
                } else {
                    img.src = "assets/images/sem-foto.jpg";
                }

                let h5 = document.createElement("h5");
                h5.innerText = `${share['first_name']} ${share['last_name']}`;

                let btnAdicionar = document.createElement("button");
                btnAdicionar.type = "button";
                btnAdicionar.innerText = "Adicionar";

                let hr = document.createElement("hr");

                perfilComp.appendChild(img);
                perfilComp.appendChild(h5);
                perfilComp.appendChild(btnAdicionar);

                campo.appendChild(perfilComp);
                campo.appendChild(hr);
            });
        }

        btnFechar.onclick = function () {
            campo.innerHTML = "";
            janela.classList.remove("mostrarPostModal");
            janela.classList.add("esconderPostModal");
        }
    });
});

// curtir ou descurtir publicação
const btnPublication = [...document.getElementsByClassName("botoes-publication")];

btnPublication.map((el) => {
    const btnLike = el.firstElementChild;

    // curtir ou descurtir publicação
    btnLike.addEventListener("click", (e) => {

        let perfilshare = el.parentElement.firstElementChild;
        let perfil_like = el.parentElement.firstElementChild;
        let elementLikes;

        if (perfilshare.classList.contains("perfilshare") || perfil_like.classList.contains("perfil_like")) {
            elementLikes = el.parentElement.children[3].firstElementChild.firstElementChild;
        } else {
            elementLikes = el.parentElement.children[2].firstElementChild.firstElementChild;
        }

        const postId = el.parentElement.dataset.postid;
        const btnLike = el.firstElementChild;

        let pedido = new XMLHttpRequest();

        pedido.open("GET", `Controllers/curtir_descurtir.php?user_id=${userId}&post_id=${postId}`, true);
        pedido.send();

        pedido.onload = function () {
            if (btnLike.innerHTML == "Curtir") {
                elementLikes.innerHTML++
            } else if (btnLike.innerHTML == "Descurtir") {
                elementLikes.innerHTML--
            }
            btnLike.innerHTML = this.responseText;
        }
    });

    const btnShare = el.lastElementChild;

    // compartilhar publicação
    btnShare.addEventListener("click", (e) => {

        const postId = el.parentElement.dataset.postid;
        const post = document.getElementById('conteudoPost');
        let publication;

        let perfilshare = el.parentElement.firstElementChild;
        let perfil_like = el.parentElement.firstElementChild;

        if (perfilshare.classList.contains("perfilshare") || perfil_like.classList.contains("perfil_like")) {
            publication = el.parentElement.children[2];
        } else {
            publication = el.parentElement.children[1];
        }

        document.getElementsByClassName('textAreaCompartModal')[0].value = "";
        const janela = document.getElementById("areaCompartModal");
        const postIdCompart = document.getElementById("postIdCompart");
        const btnFechar = document.getElementById("btnFecharCompartModal");
        document.getElementById("rshare").value = "home";

        postIdCompart.value = postId;
        post.innerHTML = publication.innerHTML;
        janela.classList.remove("esconderPostModal");
        janela.classList.add("mostrarPostModal");

        btnFechar.onclick = function () {
            document.getElementsByClassName('textAreaCompartModal')[0].value = "";
            janela.classList.remove("mostrarPostModal");
            janela.classList.add("esconderPostModal");
        }
    });
});

// comentar publicação
let btnEnviarComment = [...document.getElementsByClassName("btnEnviarComment")];
btnEnviarComment.map((el) => {
    el.addEventListener("click", () => {
        let menssage;
        let campo;
        let spanComment;
        let postId;

        let perfilshare = el.parentElement.parentElement.parentElement.firstElementChild;
        let perfil_like = el.parentElement.parentElement.parentElement.firstElementChild;

        if (perfilshare.classList.contains("perfilshare") || perfil_like.classList.contains("perfil_like")) {
            spanComment = el.parentNode.parentNode.parentNode.children[3].children[1].firstElementChild;
        } else {
            spanComment = el.parentNode.parentNode.parentNode.children[2].children[1].firstElementChild;
        }

        postId = el.parentNode.parentNode.parentNode.dataset.postid;
        campo = el.parentNode.parentNode.lastElementChild;
        menssage = el.parentNode.firstElementChild.value.replaceAll('\n', '<br/>');
        el.parentNode.firstElementChild.value = "";
        el.parentNode.firstElementChild.style.height = "15px";

        let pedidos = new XMLHttpRequest();

        if (menssage != "") {
            spanComment.innerHTML++;
            pedidos.open("GET", `Controllers/create_new_comment?comment=${menssage}&user_id=${userId}&post_id=${postId}`);
            pedidos.send();
        }
        pedidos.onloadend = function () {
            results = JSON.parse(this.response);
            campo.innerHTML = "";
            results['results'].forEach((result) => {
                createComment(postId, result, campo, spanComment);
            });
        }
    });
});

// funções para chat ==========================================================================

function enviarMessageChat(event, userId, fromId) {

    if ((event.keyCode == 13) || (event.keyCode == null)) {

        let chatMessage = document.getElementById(`chat${fromId}`);

        if (chatMessage.value != "") {

            let msg = { // cria um objeto msg
                'userId': userId,
                'fromId': fromId,
                'name': nameC,
                'photo': photo,
                'message': chatMessage.value
            }

            let pedidos = new XMLHttpRequest();

            pedidos.open("GET", `Controllers/create_new_messager_chat?messeger=${chatMessage.value}&user_id=${userId}&to_user_id=${fromId}`);
            pedidos.send();

            chatMessage.value = "";

            pedidos.onloadend = function () {
                msg = JSON.stringify(msg); //converte para json
                conn.send(msg);
            }
        }
    }
}

function showChatMessage(msg, user) {

    msg = JSON.parse(msg);

    if (user == "me") {

        let areaMenssage = document.getElementById(msg.userId + msg.fromId);

        let caixaEu = document.createElement('div');
        caixaEu.setAttribute('class', 'caixa-eu');

        let mensagemEu = document.createElement('div');
        mensagemEu.setAttribute('class', 'mensagem-eu');

        let mensagemEup = document.createElement('p');
        mensagemEup.textContent = msg.message;

        let visto = document.createElement('div');
        visto.setAttribute("class", "visto");
        visto.style = "width: 10px; height: 10px; background-color: #0f0; border-radius: 50%; margin-top: 16px; margin-left: -18px;";

        let nVisto = document.createElement('div');
        nVisto.setAttribute("class", "nvisto");
        nVisto.style = "width: 10px; height: 10px; background-color: #bbb; border-radius: 50%; margin-top: 16px; margin-left: -18px;";

        mensagemEu.appendChild(mensagemEup);
        caixaEu.appendChild(mensagemEu);
        if (msg.read_at != null) {
            caixaEu.appendChild(visto);
        } else {
            caixaEu.appendChild(nVisto);
        }

        areaMenssage.appendChild(caixaEu);

        areaMenssage.scrollTop = areaMenssage.scrollHeight;
    } else {
        let areaMenssage = document.getElementById(msg.fromId + msg.userId);
        openChat(msg.userId, msg.name, msg.photo, true);

        if (areaMenssage != null) {
            receberMensagemChat(msg);
        }

        areaMenssage.scrollTop = areaMenssage.scrollHeight;

    }
}

const receberMensagemChat = (msg) => {

    let areaMenssage = document.getElementById(msg.fromId + msg.userId);

    let caixaOutro = document.createElement('div');
    caixaOutro.setAttribute('class', 'caixa-outro');

    let mensagemOutro = document.createElement('div');
    mensagemOutro.setAttribute('class', 'mensagem-outro');

    let mensagemOutrop = document.createElement('p');
    mensagemOutrop.textContent = msg.message;

    mensagemOutro.appendChild(mensagemOutrop);
    caixaOutro.appendChild(mensagemOutro);
    areaMenssage.appendChild(caixaOutro);
}

document.getElementById("cabecalhoBatePapoPrincipal").onclick = function () {

    ocultarDesocultarBatePapo();
}

function marcarChatComoLido(fromId) {

    let pedidos = new XMLHttpRequest();
    pedidos.open("GET", `Controllers/update_messeger_chat?from_id=${fromId}&user_id=${userId}`);
    pedidos.send();

    // atualiza para visto em tempo real
    let read = { // cria um objeto msg
        'userId': userId,
        'fromId': fromId,
        'read_at': Date(),
    }

    read = JSON.stringify(read); //converte para json
    conn.send(read);
}

function ocultarDesocultarBatePapo() {

    const batepapo = document.getElementById("batePapo");

    if (batepapo.style.height == "500px") {
        batepapo.style.height = "57px";
    } else if (batepapo.style.height < "60px") {
        batepapo.style.height = "500px";
    }
}

function carregarUserChat() {

    let pedidos = new XMLHttpRequest();

    pedidos.open("GET", `Controllers/get_all_status?user_id=${userId}`);
    pedidos.send();

    pedidos.onloadend = function () {

        results = JSON.parse(this.response);

        const conversaBatePapo = document.getElementById("conversa-bate-papo");
        conversaBatePapo.innerHTML = "";

        const divTotalHistory = document.querySelector('#divTotalHistory');
        let total_nread = 0;

        results['results'].forEach((result) => {

            total_nread += parseInt(result['count_nread']);

            let nomeCompleto = `${result['first_name']} ${result['last_name']}`;
            let itemChat = document.createElement("section");
            itemChat.setAttribute("class", "itemChat");
            let count = 0;
            itemChat.onclick = function () {

                divNunHistory.style = "visibility:hidden; width:37px; font-size: 10pt; color: #fff; height: 21px; padding-top: 5px; background-color:rgb(141 0 0 / 80%); position: relative; right: 10px; top: 20px; border-radius: 50%;text-align: center; font-weight: bold;";
                if(count == 0){
                    divTotalHistory.innerHTML -= divNunHistory.innerHTML;
                    count++
                }
                if (onlines.includes(result['id'])) {
                    openChat(result['id'], nomeCompleto, result['photo_url'], true);
                } else {
                    openChat(result['id'], nomeCompleto, result['photo_url'], false);
                }

            }

            let div = document.createElement("div");

            let imgPerfil = document.createElement("img");
            if (result['photo_url'] != null) {
                imgPerfil.src = `assets/images/${result['photo_url']}`;
            } else {
                imgPerfil.src = "assets/images/sem-foto.jpg";
            }

            let statu = document.createElement("div");

            if (onlines.includes(result['id'])) {
                statu.setAttribute("class", "online");
            } else {
                statu.setAttribute("class", "offline");
            }

            let mensagem = document.createElement("div");
            mensagem.setAttribute("class", "mensagem");

            let nome = document.createElement("h3");
            nome.innerText = nomeCompleto;

            let historico = document.createElement("p");
            historico.id = `his${result['id']}`;
            if (result['messeger'] != undefined) {
                historico.innerText = result['messeger'];
            } else {
                historico.innerText = "Sem nova mensagem";
            }


            let hr = document.createElement("hr");

            let divNunHistory = document.createElement('div');
            divNunHistory.setAttribute("class", "divNunHistory");

            if (result['count_nread'] > 0) {
                divNunHistory.style = "width:37px; font-size: 10pt; color: #fff; height: 21px; padding-top: 5px; background-color:rgb(141 0 0 / 80%); position: relative; right: 10px; top: 20px; border-radius: 50%;text-align: center; font-weight: bold;";
            } else {
                divNunHistory.style = "visibility:hidden; width:37px; font-size: 10pt; color: #fff; height: 21px; padding-top: 5px; background-color:rgb(141 0 0 / 80%); position: relative; right: 10px; top: 20px; border-radius: 50%;text-align: center; font-weight: bold;";
            }

            divNunHistory.innerText = result['count_nread'];

            mensagem.appendChild(nome);
            mensagem.appendChild(historico);
            mensagem.appendChild(hr);

            div.appendChild(imgPerfil);
            div.appendChild(statu);

            itemChat.appendChild(div);
            itemChat.appendChild(mensagem);
            itemChat.appendChild(divNunHistory);

            conversaBatePapo.appendChild(itemChat);
            divTotalHistory.innerHTML = total_nread;
        });
    }
}

function openChat(fromId, nomeCompleto, perfImg, online) {

    marcarChatComoLido(fromId);

    const myElement = document.getElementById(userId + fromId);

    if (myElement == null) {

        let areaChat = document.getElementById("area-chat");

        let batePapoPerfil = document.createElement('section');
        batePapoPerfil.setAttribute('class', 'bate-papo-perfil');
        batePapoPerfil.style = 'height: 500px';

        let headerPapoPerfil = document.createElement('header');
        headerPapoPerfil.setAttribute('class', 'perfil-bate-papo-perfil');
        headerPapoPerfil.id = "cabecalhoBatePapo";

        headerPapoPerfil.onclick = function () {
            areaChat.removeChild(batePapoPerfil);
        }

        let div = document.createElement('div');

        let img = document.createElement('img');
        if (perfImg != null) {
            img.src = `assets/images/${perfImg}`;
        } else {
            img.src = "assets/images/sem-foto.jpg";
        }

        let status = document.createElement('div');

        if (online) {
            status.setAttribute("class", "online");
        } else {
            status.setAttribute("class", "offline");
        }

        let div2 = document.createElement('div');

        let h3 = document.createElement('h3');
        h3.innerText = nomeCompleto;

        let hr = document.createElement('hr');

        div2.appendChild(h3);
        div.appendChild(img);
        div.appendChild(status);
        headerPapoPerfil.appendChild(div);
        headerPapoPerfil.appendChild(div2);
        batePapoPerfil.appendChild(headerPapoPerfil);
        batePapoPerfil.appendChild(hr);

        let conversaBatePapoPerfil = document.createElement("section");
        conversaBatePapoPerfil.setAttribute("class", "conversa-bate-papo-perfil");
        conversaBatePapoPerfil.id = userId + fromId;

        let submitBatePapo = document.createElement("div");
        submitBatePapo.setAttribute("class", "submit-bate-papo");
        submitBatePapo.id = "submit-bate-papo";

        let input = document.createElement("input");
        input.setAttribute("class", "chatMessage");
        input.id = `chat${fromId}`;
        input.type = "text";
        input.onkeydown = function (event) {
            enviarMessageChat(event, userId, fromId);
        }

        let btnchat = document.createElement("button");
        btnchat.setAttribute("class", "btnChat");
        btnchat.type = "button";
        btnchat.id = `btnChat${userId}`;
        btnchat.innerText = "Enviar";
        btnchat.onclick = function (event) {
            enviarMessageChat(event, userId, fromId);
        }

        submitBatePapo.appendChild(input);
        submitBatePapo.appendChild(btnchat);

        batePapoPerfil.appendChild(conversaBatePapoPerfil);
        batePapoPerfil.appendChild(submitBatePapo);

        areaChat.appendChild(batePapoPerfil);

        let pedidos = new XMLHttpRequest();
        pedidos.open("GET", `Controllers/get_messager_chat?user_id=${userId}&to_user_id=${fromId}`, true);
        pedidos.send();

        pedidos.onloadend = function () {

            results = JSON.parse(this.response);
            results['results'].forEach((result) => {

                if (userId == fromId && result['user_id'] == result['to_user_id']) {
                    // eu enviei para mim mesmo
                    let msg = { // cria um objeto msg
                        'userId': userId,
                        'fromId': fromId,
                        'message': result['messeger'],
                        'read_at': result['read_at']
                    }
                    msg = JSON.stringify(msg); //converte para json
                    showChatMessage(msg, "me");
                }

                if (userId != fromId && userId == result['user_id'] && result['user_id'] != result['to_user_id'] && fromId == result['to_user_id']) {
                    // eu enviei para outra pessoa
                    let msg = { // cria um objeto msg
                        'userId': userId,
                        'fromId': fromId,
                        'message': result['messeger'],
                        'read_at': result['read_at']
                    }
                    msg = JSON.stringify(msg); //converte para json
                    showChatMessage(msg, "me");
                }
                if (userId != fromId && result['user_id'] != result['to_user_id'] && fromId == result['user_id']) {
                    // eu recebi de outra pessoa
                    let msg = { // cria um objeto msg
                        'userId': fromId,
                        'fromId': userId,
                        'message': result['messeger'],
                        'read_at': result['read_at']
                    }
                    msg = JSON.stringify(msg); //converte para json
                    showChatMessage(msg, "other");
                }
            });
        }
    }
}

// =======================================================================================================