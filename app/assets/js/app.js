
let conn = new WebSocket('ws:localhost:8080/wss');
//let conn = new WebSocket('ws:192.168.0.100:8080/wss');
let userId = document.getElementById("userId").value;
let nameC = document.getElementById("nameC").value;
let photo = document.getElementById("photo").value;
let onlines;

//mostrarPosts();

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
        onlines = JSON.stringify(data);
        carregarUserChat();
    } else if (data.userId != userId) {
        let dados = JSON.stringify(data);
        showChatMessage(dados, "other", userId);
    } else {
        let dados = JSON.stringify(data);
        showChatMessage(dados, "me", userId);
    }
};

function enviarMessageChat(event, userId, fromId) {

    if ((event.keyCode == 13) || (event.keyCode == null)) {

        let chatMessage = document.getElementById("chat" + fromId);

        if (chatMessage.value != "") {

            let msg = { // cria um objeto msg
                'userId': userId,
                'fromId': fromId,
                'name': nameC,
                'photo': photo,
                'message': chatMessage.value
            }

            let pedidos = new XMLHttpRequest();

            pedidos.open("GET", "Controllers/create_new_messager_chat?messeger=" + chatMessage.value + "&user_id=" + userId + "&to_user_id=" + fromId);
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

        areaMenssage.scrollTop = areaMenssage.scrollHeight;

        let caixaEu = document.createElement('div');
        caixaEu.setAttribute('class', 'caixa-eu');

        let mensagemEu = document.createElement('div');
        mensagemEu.setAttribute('class', 'mensagem-eu');

        let mensagemEup = document.createElement('p');
        mensagemEup.textContent = msg.message;

        mensagemEu.appendChild(mensagemEup);
        caixaEu.appendChild(mensagemEu);
        areaMenssage.appendChild(caixaEu);


    } else {

        let areaMenssage = document.getElementById(msg.fromId + msg.userId);
        openChat(msg.userId, msg.name, msg.photo, true);

        if (areaMenssage != null) {
            receberMensagemChat(msg);
        }
    }
}

function receberMensagemChat(msg) {

    let areaMenssage = document.getElementById(msg.fromId + msg.userId);
    areaMenssage.scrollTo(0, document.body.scrollHeight);

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

function verComment(userId, postId, postUserId, janelaPosition) {

    let janela = document.getElementsByClassName('commentArea')[janelaPosition];
    let campo = document.getElementsByClassName('area')[janelaPosition];

    if (janela.classList.contains("ocult")) {
        janela.classList.remove("ocult");
        janela.classList.add("most");
    } else {
        janela.classList.remove("most");
        janela.classList.add("ocult");
    }

    let pedidos = new XMLHttpRequest();

    pedidos.open("GET", "Controllers/get_comments?post_id=" + postId);
    pedidos.send();

    pedidos.onloadend = function () {

        results = JSON.parse(this.response);
        campo.innerHTML = "";
        results['results'].forEach((result) => {
            let commentUserId = result['user_id'];
            let commentId = result['id'];

            let perfilComment = document.createElement("header");
            perfilComment.setAttribute("class", "perfil_comment");

            let div = document.createElement("div");

            let img = document.createElement("img");
            if (result['co_photo_url'] != null) {
                img.src = "assets/images/" + result['co_photo_url'];
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

                deletComment(result['id'], postId, postUserId, userId, position);
            }

            let corpoComment = document.createElement("div");
            corpoComment.setAttribute("class", "corpo_comment");

            let nomePerf = document.createElement("p");
            nomePerf.setAttribute("class", "nomePerf");
            nomePerf.innerText = result['co_first_name'] + " " + result['co_last_name'];

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
        });
    }
}

function deletComment(commentId, postId, postUserId, userId, position) {

    let campo = document.getElementsByClassName("area")[position];
    let pedidos = new XMLHttpRequest();

    pedidos.open("GET", "Controllers/delete_comment?id=" + commentId + "&post_id=" + postId);
    pedidos.send();

    pedidos.onloadend = function () {

        results = JSON.parse(this.response);
        document.getElementsByClassName("comment")[position].innerHTML--;
        campo.innerHTML = "";
        results['results'].forEach((result) => {
            let commentUserId = result['user_id'];
            let commentId = result['id'];

            let perfilComment = document.createElement("header");
            perfilComment.setAttribute("class", "perfil_comment");

            let div = document.createElement("div");

            let img = document.createElement("img");
            if (result['co_photo_url'] != null) {
                img.src = "assets/images/" + result['co_photo_url'];
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
                deletComment(result['id'], postId, postUserId, userId, position);
            }

            let corpoComment = document.createElement("div");
            corpoComment.setAttribute("class", "corpo_comment");

            let nomePerf = document.createElement("p");
            nomePerf.setAttribute("class", "nomePerf");
            nomePerf.innerText = result['co_first_name'] + " " + result['co_last_name'];

            let p = document.createElement("p");
            p.innerText = result['comment'];

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

function comment(userId, postId, postUserId, position) {

    let menssage = document.getElementsByClassName("txtTextAreaComment")[position].value.replaceAll('\n', '<br/>');
    document.getElementsByClassName("txtTextAreaComment")[position].value = "";
    document.getElementsByClassName("txtTextAreaComment")[position].style.height = "15px";
    let campo = document.getElementsByClassName("area")[position];
    let pedidos = new XMLHttpRequest();

    if (menssage != "") {

        document.getElementsByClassName("comment")[position].innerHTML++;

        pedidos.open("GET", "Controllers/create_new_comment?comment=" + menssage + "&user_id=" + userId + "&post_id=" + postId);
        pedidos.send();
    }

    pedidos.onloadend = function () {

        results = JSON.parse(this.response);
        campo.innerHTML = "";
        results['results'].forEach((result) => {
            let commentUserId = result['user_id'];
            let commentId = result['id'];

            let perfilComment = document.createElement("header");
            perfilComment.setAttribute("class", "perfil_comment");

            let div = document.createElement("div");

            let img = document.createElement("img");
            if (result['co_photo_url'] != null) {
                img.src = "assets/images/" + result['co_photo_url'];
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
                deletComment(result['id'], postId, postUserId, userId, position);
            }

            let corpoComment = document.createElement("div");
            corpoComment.setAttribute("class", "corpo_comment");

            let nomePerf = document.createElement("p");
            nomePerf.setAttribute("class", "nomePerf");
            nomePerf.innerText = result['co_first_name'] + " " + result['co_last_name'];

            let p = document.createElement("p");
            p.innerText = result['comment'];

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

        });

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

function mostrarCompartilhamentos(postId) {
    const janela = document.getElementById("arealinksComp");
    const btnFechar = document.getElementById("btnFecharComp");

    const totalShares = document.querySelector(".totalComp span");
    const campo = document.querySelector(".campoComp");
    const imagem = document.querySelector(".campoComp .perfilComp img");

    campo.innerHTML = "";

    let pedidos = new XMLHttpRequest();

    pedidos.open("GET", "Controllers/get_all_shares/index.php?post_id=" + postId);
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
                img.src = "assets/images/" + share['photo_url'];
            } else {
                img.src = "assets/images/sem-foto.jpg";
            }

            let h5 = document.createElement("h5");
            h5.innerText = share['first_name'] + " " + share['last_name'];

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
}

function mostrarCurtidas(postId) {

    const janela = document.getElementById("arealinksCurtidas");
    const btnFechar = document.getElementById("btnFecharCurtidas");

    const totalLikes = document.querySelector(".totalCurtidas span");
    const campo = document.querySelector(".campoCurtidas");
    //const imagem = document.querySelector(".campoCurtidas .perfilCurtidas img");

    campo.innerHTML = "";

    let pedidos = new XMLHttpRequest();

    pedidos.open("GET", "Controllers/get_all_likes/index.php?post_id=" + postId);
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
                img.src = "assets/images/" + like['photo_url'];
            } else {
                img.src = "assets/images/sem-foto.jpg";
            }

            let h5 = document.createElement("h5");
            h5.innerText = like['first_name'] + " " + like['last_name'];

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
}

function postMenuDrop(itemPosition, post_users, user) {

    let item = document.getElementsByClassName('linksPostMenuDrop')[itemPosition];

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

    if (user == post_users) {
        item.classList.toggle("visivel");
    }
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

function editModal(postId, postPosition) {

    const janela = document.getElementById("areaPostModal");
    const btnFechar = document.getElementById("btnFecharPostModal");
    const post = document.getElementsByClassName('post')[postPosition];

    document.querySelector('.postModal .cabecalhoPostModal h4').innerText = "Editar publicação";
    document.querySelector("#postForm button").innerHTML = "Salvar";
    document.querySelector("#postForm").action = "Controllers/postUpdate.php";

    document.getElementById("postId").value = postId;

    document.querySelector("#postForm textarea").value = post.innerText;

    janela.classList.remove("esconderPostModal");
    janela.classList.add("mostrarPostModal");

    btnFechar.onclick = function () {
        document.querySelector("#postForm textarea").value = "";
        janela.classList.remove("mostrarPostModal");
        janela.classList.add("esconderPostModal");
    }
}

document.getElementById("cabecalhoBatePapo").onclick = function () {

    ocultarDesocultarBatePapo();
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

    pedidos.open("GET", "Controllers/get_all_status");
    pedidos.send();

    pedidos.onloadend = function () {

        results = JSON.parse(this.response);

        let conversaBatePapo = document.getElementById("conversa-bate-papo");
        conversaBatePapo.innerHTML = "";

        results['results'].forEach((result) => {

            let nomeCompleto = result['first_name'] + " " + result['last_name'];

            let itemChat = document.createElement("section");
            itemChat.id = "itemChat";
            itemChat.onclick = function () {
                if (onlines.includes(result['id'])) {
                    openChat(result['id'], nomeCompleto, result['photo_url'], true);
                } else {
                    openChat(result['id'], nomeCompleto, result['photo_url'], false);
                }

            }

            let div = document.createElement("div");

            let imgPerfil = document.createElement("img");
            if (result['photo_url'] != null) {
                imgPerfil.src = "assets/images/" + result['photo_url'];
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
            historico.id = "his" + result['id'];
            historico.innerText = "his" + result['id'];

            let hr = document.createElement("hr");


            mensagem.appendChild(nome);
            mensagem.appendChild(historico);
            mensagem.appendChild(hr);

            div.appendChild(imgPerfil);
            div.appendChild(statu);

            itemChat.appendChild(div);
            itemChat.appendChild(mensagem);

            conversaBatePapo.appendChild(itemChat);

        });
    }
}

function openChat(fromId, nomeCompleto, perfImg, online) {

    //msg.userId, msg.name, msg.photo
    // fromId, nomeCompleto, perfImg


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

            // if (batePapoPerfil.style.height == "500px") {
            //     batePapoPerfil.style.height = "57px";
            // } else if (batePapoPerfil.style.height < "60px") {
            //     batePapoPerfil.style.height = "500px";
            // }
        }

        let div = document.createElement('div');

        let img = document.createElement('img');
        if (perfImg != null) {
            img.src = "assets/images/" + perfImg;
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
        input.id = "chat" + fromId;
        input.type = "text";
        input.onkeydown = function (event) {
            enviarMessageChat(event, userId, fromId);
        }

        let btnchat = document.createElement("button");
        btnchat.setAttribute("class", "btnChat");
        btnchat.type = "button";
        btnchat.id = "btnChat" + userId;
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
        pedidos.open("GET", "Controllers/get_messager_chat?user_id=" + userId + "&to_user_id=" + fromId, true);
        pedidos.send();

        pedidos.onloadend = function () {

            results = JSON.parse(this.response);
            results['results'].forEach((result) => {

                if (userId == fromId && result['user_id'] == result['to_user_id']) {
                    // eu enviei para mim mesmo
                    let msg = { // cria um objeto msg
                        'userId': userId,
                        'fromId': fromId,
                        'message': result['messeger']
                    }
                    msg = JSON.stringify(msg); //converte para json
                    showChatMessage(msg, "me");
                }

                if (userId != fromId && userId == result['user_id'] && result['user_id'] != result['to_user_id'] && fromId == result['to_user_id']) {
                    // eu enviei para outra pessoa
                    let msg = { // cria um objeto msg
                        'userId': userId,
                        'fromId': fromId,
                        'message': result['messeger']
                    }
                    msg = JSON.stringify(msg); //converte para json
                    showChatMessage(msg, "me");
                }
                if (userId != fromId && result['user_id'] != result['to_user_id'] && fromId == result['user_id']) {
                    // eu recebi de outra pessoa
                    let msg = { // cria um objeto msg
                        'userId': fromId,
                        'fromId': userId,
                        'message': result['messeger']
                    }
                    msg = JSON.stringify(msg); //converte para json
                    showChatMessage(msg, "other");
                }
            });
        }
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
        xmlhttp.open("GET", "../api/pesq_users/index.php?q=" + str, true);
        xmlhttp.send();
    }
}

function share(post_id, position, pagina) { // compartilhar publicação

    const post = document.getElementById('conteudoPost');
    const publication = document.getElementsByClassName('publicationPost')[position];
    document.getElementsByClassName('textAreaCompartModal')[0].value = "";
    const janela = document.getElementById("areaCompartModal");
    const postIdCompart = document.getElementById("postIdCompart");
    const btnFechar = document.getElementById("btnFecharCompartModal");
    document.getElementById("rshare").value = pagina;

    postIdCompart.value = post_id;

    post.innerHTML = publication.innerHTML;

    janela.classList.remove("esconderPostModal");
    janela.classList.add("mostrarPostModal");

    btnFechar.onclick = function () {
        document.getElementsByClassName('textAreaCompartModal')[0].value = "";
        janela.classList.remove("mostrarPostModal");
        janela.classList.add("esconderPostModal");
    }
}

function like(post_id, userId, element, elementLikesPosition) { // curtir ou descurtir publicação

    let elementLikes = document.getElementsByClassName('like')[elementLikesPosition];

    let pedido = new XMLHttpRequest();

    pedido.open("GET", "Controllers/curtir_descurtir.php?user_id=" + userId + "&post_id=" + post_id, true);
    pedido.send();

    pedido.onload = function () {
        if (element.innerHTML == "Curtir") {
            elementLikes.innerHTML++
        } else if (element.innerHTML == "Descurtir") {
            elementLikes.innerHTML--
        }
        element.innerHTML = this.responseText;
    }
}

// function mostrarPosts() {

//     let pedido = new XMLHttpRequest();

//     pedido.open("GET", "Controllers/get_all_posts.php?user_id=" + userId, true);
//     pedido.send();

//     pedido.onloadend = function () {

//         results = JSON.parse(this.response);
//         console.log(results);
//         results['results'].forEach((result) => {

//           //  let totals = new XMLHttpRequest();
//            // totals.open("GET", "Controllers/totals.php?post_id=" + result["id"], true);
//            // totals.send();

//           //  totals.onloadend = function () {

//           //      total = JSON.parse(this.response);
                
//              //   let TotalLikes = total['results']['0']['totals'];
//             //    let TotalComments = total['results']['1']['totals'];
//             //    let TotalShares = total['results']['2']['totals'];

//                 let publication = document.createElement("section");
//                 publication.setAttribute("class", "publication");

//                 let perfilshare = document.createElement("header");
//                 let perfilLike = document.createElement("header");
//                 if (result['sh_user_id'] != null) {
//                     perfilshare.setAttribute("class", "perfilshare");

//                     let divShare = document.createElement("div");
//                     let imgShare = document.createElement("img");
//                     if (result['sh_photo_url'] != null) {
//                         imgShare.src = "assets/images/" + result['sh_photo_url'];
//                     } else {
//                         imgShare.src = "assets/images/sem-foto.jpg"
//                     }

//                     let pShare = document.createElement("p");

//                     //    if () {
//                     pShare.innerText = result['sh_first_name'] + " " + result['sh_last_name'] + " compartilhou isso!";
//                     //    } else {
//                     pShare.innerText = result['sh_first_name'] + " " + result['sh_last_name'] + " e outras tantas pessoas compartilhou isso!";
//                     //   }

//                     let shareComment = document.createElement("p");
//                     shareComment.setAttribute("class", "shareComment");

//                     divShare.appendChild(imgShare);
//                     divShare.appendChild(pShare);
//                     perfilshare.appendChild(divShare);
//                     perfilshare.appendChild(shareComment);

//                 } else if (result["lik_user_id"] != null) {
//                     perfilLike.setAttribute("class", "perfil_like");

//                     let divLike = document.createElement("div");

//                     let imgLike = document.createElement("img");
//                     if (result['lik_photo_url']) {
//                         imgLike.src = "assets/images/" + result['lik_photo_url'];
//                     } else {
//                         imgLike.src = "assets/images/sem-foto.jpg"
//                     }

//                     let pLike = document.createElement("p");

//                     //   if () {
//                     pLike.innerText = result['lik_first_name'] + " " + result['lik_last_name'] + " curtiu isso!";
//                     //   } else {
//                     pLike.innerText = result['lik_first_name'] + " " + result['lik_last_name'] + " e outras tantas pessoas curtiu isso!";
//                     //   }
//                     divLike.appendChild(imgLike);
//                     divLike.appendChild(pLike);
//                     perfilLike.appendChild(divLike);
//                 }

//                 let postsMenuDrop = document.createElement("div");
//                 postsMenuDrop.setAttribute("class", "postMenuDrop");

//                 let linksPostMenuDrop = document.createElement("div");
//                 linksPostMenuDrop.setAttribute("class", "linksPostMenuDrop");

//                 let btnPostMenuDrop = document.createElement("button");
//                 btnPostMenuDrop.setAttribute("class", "btnPostMenuDrop");
//                 btnPostMenuDrop.id = "postMenuDrop";
//                 btnPostMenuDrop.onclick = function () {
//                     postMenuDrop(linksPostMenuDrop, result["user_id"], userId);
//                 }
//                 btnPostMenuDrop.innerText = "...";

//                 let navLinks = document.createElement("nav");
//                 navLinks.setAttribute("class", "navLinks");
//                 navLinks.id = "navLinks";

//                 let post = document.createElement("p");
//                 post.setAttribute("class", "post");
//                 post.id = "post";
//                 post.innerHTML = result['post'];

//                 let edit = document.createElement("a");
//                 edit.innerText = "Editar";
//                 edit.onclick = function () {
//                     editModal(result["id"], post);
//                 }

//                 let delet = document.createElement("a");
//                 delet.innerText = "Excluir";
//                 delet.href = "Controllers/delete_post.php?id=" + result["id"];

//                 linksPostMenuDrop.appendChild(edit);
//                 linksPostMenuDrop.appendChild(delet);
//                 navLinks.appendChild(linksPostMenuDrop);
//                 postsMenuDrop.appendChild(btnPostMenuDrop);
//                 postsMenuDrop.appendChild(navLinks);

//                 let publicationPost = document.createElement("div");
//                 publicationPost.setAttribute("class", "publicationPost");

//                 let perfil = document.createElement("header");
//                 perfil.setAttribute("class", "perfil");

//                 let divPerfil = document.createElement("div");

//                 let imgPerfil = document.createElement("img");
//                 if (result['photo_url'] != null) {
//                     imgPerfil.src = "assets/images/" + result['photo_url'];
//                 } else {
//                     imgPerfil.src = "assets/images/sem-foto.jpg";
//                 }

//                 let cabecalho = document.createElement("div");
//                 cabecalho.setAttribute("class", "cabecalho");

//                 let postCabecalho = document.createElement("div");
//                 postCabecalho.setAttribute("class", "postCabecalho");

//                 let h3PostCabecalho = document.createElement("h3");
//                 h3PostCabecalho.innerText = result["first_name"] + " " + result["last_name"];

//                 let h5PostCabecalho = document.createElement("h5");
//                 //if(){
//                 h5PostCabecalho.innerText = "?= $intervalo_post->s .  Segundos atrás";
//                 // }else{
//                 h5PostCabecalho.innerText = "Agora mesmo";
//                 // }

//                 let divPublicationPost = document.createElement("div");

//                 // let imgDivPublicationPost = document.createElement("img");
//                 // imgDivPublicationPost.src = "assets/images/?= $post['foto_url'] ?";

//                 divPerfil.appendChild(imgPerfil);
//                 postCabecalho.appendChild(h3PostCabecalho);
//                 cabecalho.appendChild(postCabecalho);
//                 cabecalho.appendChild(h5PostCabecalho);
//                 perfil.appendChild(divPerfil);
//                 perfil.appendChild(cabecalho);
//                 divPublicationPost.appendChild(post);
//                 // divPublicationPost.appendChild(imgDivPublicationPost);
//                 publicationPost.appendChild(perfil);
//                 publicationPost.appendChild(divPublicationPost);

//                 let curtidasComentarios = document.createElement("div");
//                 curtidasComentarios.setAttribute("class", "curtidas-comentarios");

//                 let curtidas = document.createElement("div");
//                 curtidas.setAttribute("class", "curtidas");

//                 let likes = document.createElement("p");
//                 likes.setAttribute("class", "like");
//                 likes.innerText = "TotalLikes";
//                 likes.onclick = function () {
//                     mostrarCurtidas(id);
//                 }

//                 let spanLike = document.createElement("span");
//                 spanLike.onclick = function () {
//                     mostrarCurtidas(id);
//                 }
//                // if (TotalLikes > 1) {
//                     spanLike.innerText = "Curtidas";
//               //  } else {
//                     spanLike.innerText = "Curtida";
//               //  }

//                 let comentarios = document.createElement("div");
//                 comentarios.setAttribute("class", "comentarios");

//                 let comment = document.createElement("p");
//                 comment.setAttribute("class", "comment");
//                 comment.id = "comment";
//                 comment.innerText = "TotalComments";
//                 comment.onclick = function () {
//                     mostrar($i);
//                 }

//                 let spanComment = document.createElement("span");
//                 spanComment.onclick = function () {
//                     verComment(user_id, id, user_id, $i);
//                 }
//               //  if (TotalComments > 1) {
//                     spanComment.innerText = "Comentários";
//               //  } else {
//                     spanComment.innerText = "Comentário";
//               //  }

//                 let compartilhamentos = document.createElement("div");
//                 compartilhamentos.setAttribute("class", "compartilhamentos");

//                 let share = document.createElement("p");
//                 share.setAttribute("class", "share");
//                 share.innerText = "TotalShares";
//                 share.onclick = function () {
//                     mostrarCompartilhamentos(id);
//                 }

//                 let spanShare = document.createElement("span");
//                 spanShare.onclick = function () {
//                     mostrarCompartilhamentos(id);
//                 }
//                // if (TotalShares > 1) {
//                     spanShare.innerText = "Compartilhamentos";
//                // } else {
//                     spanShare.innerText = "Compartilhamento";
//                // }

//                 curtidas.appendChild(likes);
//                 curtidas.appendChild(spanLike);
//                 comentarios.appendChild(comment);
//                 comentarios.appendChild(spanComment);
//                 compartilhamentos.appendChild(share);
//                 compartilhamentos.appendChild(spanShare);
//                 curtidasComentarios.appendChild(curtidas);
//                 curtidasComentarios.appendChild(comentarios);
//                 curtidasComentarios.appendChild(compartilhamentos);

//                 let hrPost = document.createElement("hr");

//                 let botoesPublication = document.createElement("div");
//                 botoesPublication.setAttribute("class", "botoes-publication");

//                 let btnCurtir = document.createElement("button");
//                 btnCurtir.type = "button";
//                 btnCurtir.onclick = function () {
//                     like(result["id"], userId, this, likes);
//                 }
//                  if (result["li_post_id"] == null) {
//                 btnCurtir.innerText = "Curtir";
//                  } else {
//                 btnCurtir.innerText = "Descurtir";
//                  }

//                  let commentArea = document.createElement("div");
//                 commentArea.setAttribute("class", "commentArea ocult");

//                 let area = document.createElement("div");
//                 area.setAttribute("class", "area");

//                 let btnComentar = document.createElement("button");
//                 btnComentar.type = "button";
//                 btnComentar.innerText = "Comentar";
//                 btnComentar.onclick = function () {
//                     verComment(userId, result["id"], result["user_id"], commentArea, area);
//                 }

//                 let btnCompartilhar = document.createElement("button");
//                 btnCompartilhar.type = "button";
//                 btnCompartilhar.innerText = "Compartilhar";
//                 btnCompartilhar.onclick = function () {
//                     share(id, $i);
//                 }

//                 botoesPublication.appendChild(btnCurtir);
//                 botoesPublication.appendChild(btnComentar);
//                 botoesPublication.appendChild(btnCompartilhar);

//                 let commentar = document.createElement("div");
//                 commentar.setAttribute("class", "commentar");

//                 let textareaCommentar = document.createElement("textarea");
//                 textareaCommentar.setAttribute("class", "txtTextAreaComment");
//                 textareaCommentar.id = "txtTextAreaComment";
//                 textareaCommentar.placeholder = "Escreva um comentário";
//                 textareaCommentar.onkeyup = function () {
//                     autoResize(this);
//                 }

//                 let btnCommentar = document.createElement("button");
//                 btnCommentar.type = "button";
//                 btnCommentar.innerText = "Enviar";
//                 btnCommentar.onclick = function () {
//                     comment(user_id, id, user_id, $i);
//                 }

//                 commentar.appendChild(textareaCommentar);
//                 commentar.appendChild(btnCommentar);
//                 commentArea.appendChild(commentar);
//                 commentArea.appendChild(area);

//                 if (result["sh_user_id"] != null) {
//                     publication.appendChild(perfilshare);
//                 } else if (result["lik_user_id"] != null) {
//                     publication.appendChild(perfilLike);
//                 }
//                 publication.appendChild(postsMenuDrop);
//                 publication.appendChild(publicationPost);
//                 publication.appendChild(curtidasComentarios);
//                 publication.appendChild(hrPost);
//                 publication.appendChild(botoesPublication);
//                 publication.appendChild(commentArea);

//                 let posts = document.getElementsByClassName("posts")[0];
//                 posts.appendChild(publication);
//            // }
//         });
//     }

// }