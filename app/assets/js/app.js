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

getAllUsers();

function getAllUsers(){

    const posts = document.getElementById("posts");

    let areaPost = document.createElement("div");
    areaPost.setAttribute("class","areaPost");
    areaPost.setAttribute("id","areaPost");

    posts.appendChild(areaPost);

    const endPoint = `Controllers/get_all_posts?user_id=${userId}`;
    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {
                results['results'].forEach((result) => {
                    createPost(result);
                });
    
            } else {
                console.log(results['message']);
            }
        }).catch(error => {
            // Lidar com erros
            console.error('Erro:', error);
        });
}

function createPost(result) {

    const areaPost = document.getElementById("areaPost");;

    let publication = document.createElement("section");
    publication.setAttribute("class", "publication");

    if (result.sh_user_id != null) {

        let perfil_share = document.createElement("header");
        perfil_share.setAttribute("class", "perfilshare");
        let div = document.createElement("div");

        let imgShare = document.createElement("img");
        imgShare.setAttribute("src", "assets/images/sem-foto.jpg");

        let pMensagemShare = document.createElement("p");
        pMensagemShare.innerHTML = `${result.sh_first_name} ${result.sh_last_name} compartilhou isso!`;

        div.appendChild(imgShare);
        div.appendChild(pMensagemShare);
        perfil_share.appendChild(div);
        publication.appendChild(perfil_share);

    } else if (result.lik_user_id != null) {

        let perfil_like = document.createElement("header");
        perfil_like.setAttribute("class", "perfil_like");
        let div = document.createElement("div");

        let imgLike = document.createElement("img");
        imgLike.setAttribute("src", "assets/images/sem-foto.jpg");

        let pMensagemLike = document.createElement("p");

        if (result.t_likes <= 1) {
            pMensagemLike.innerHTML = `${result.lik_first_name} ${result.lik_last_name} curtiu isso!`;
        } else {
            pMensagemLike.innerHTML = `${result.lik_first_name} ${result.lik_last_name} e outras ${result.t_likes}  pessoas curtiu isso!`;
        }

        div.appendChild(imgLike);
        div.appendChild(pMensagemLike);
        perfil_like.appendChild(div);
        publication.appendChild(perfil_like);
    }

    let postMenuDrop = document.createElement("div");
    postMenuDrop.setAttribute("class", "postMenuDrop");

    let btnPostMenuDrop = document.createElement("button");
    btnPostMenuDrop.setAttribute("class", "btnPostMenuDrop");
    btnPostMenuDrop.innerHTML = "...";
    btnPostMenuDrop.onclick = () => {
        if (userId == result.user_id) {
            linksPostMenuDrop.classList.toggle("visivel");
        }
    }

    let navLinks = document.createElement("nav");
    navLinks.setAttribute("class", "navLinks");

    let linksPostMenuDrop = document.createElement("div");
    linksPostMenuDrop.setAttribute("class", "linksPostMenuDrop");

    let linkEditar = document.createElement("a");
    linkEditar.innerHTML = "Editar";
    linkEditar.onclick = () => {
        editarPost(linkEditar, result);
    }

    let linkExcluir = document.createElement("a");
    linkExcluir.innerHTML = "Excluir";
    linkExcluir.onclick = () => {
        excluirPost(publication, result);
    }

    linksPostMenuDrop.appendChild(linkEditar);
    linksPostMenuDrop.appendChild(linkExcluir);
    navLinks.appendChild(linksPostMenuDrop);
    postMenuDrop.appendChild(btnPostMenuDrop);
    postMenuDrop.appendChild(navLinks);
    publication.appendChild(postMenuDrop);

    publicationPost = document.createElement("div");
    publicationPost.setAttribute("class", "publicationPost");

    perfil = document.createElement("header");
    perfil.setAttribute("class", "perfil");

    let div = document.createElement("div");

    let imgPerf = document.createElement("img");
    imgPerf.setAttribute("src", "assets/images/sem-foto.jpg");

    div.appendChild(imgPerf);
    perfil.appendChild(div);

    cabecalho = document.createElement("div");
    cabecalho.setAttribute("class", "cabecalho");

    postCabecalho = document.createElement("div");
    postCabecalho.setAttribute("class", "postCabecalho");

    h3 = document.createElement("h3");
    h3.innerHTML = `${result.first_name} ${result.last_name}`;

    h5 = document.createElement("h5");
    h5.innerHTML = result.created_at;

    postCabecalho.appendChild(h3);
    cabecalho.appendChild(postCabecalho);
    cabecalho.appendChild(h5);
    perfil.appendChild(cabecalho);

    divPost = document.createElement("div");
    pPost = document.createElement("p");
    pPost.setAttribute("class", "pPost");
    pPost.setAttribute("id", "post");
    pPost.innerHTML = result.post;

    divPost.appendChild(pPost);
    publicationPost.appendChild(perfil);
    publicationPost.appendChild(divPost);

    let curtidasComentarios = document.createElement("div");
    curtidasComentarios.setAttribute("class", "curtidas-comentarios");

    let curtidas = document.createElement("div");
    curtidas.setAttribute("class", "curtidas");
    curtidas.onclick = () => {
        showLikes(result);
    }

    let pLike = document.createElement("p");
    pLike.setAttribute("class", "like");
    pLike.innerHTML = result.t_likes;

    let spanLike = document.createElement("span");
    spanLike.innerHTML = "Curtidas"

    curtidas.appendChild(pLike);
    curtidas.appendChild(spanLike);
    curtidasComentarios.appendChild(curtidas);

    let comentarios = document.createElement("div");
    comentarios.setAttribute("class", "comentarios");
    comentarios.onclick = () => {
        showComments(comentarios, result);
    }

    let pComment = document.createElement("p");
    pComment.setAttribute("class", "spanComment");
    pComment.innerHTML = result.t_comments;

    let spanComment = document.createElement("span");
    spanComment.innerHTML = "Comentários"

    comentarios.appendChild(pComment);
    comentarios.appendChild(spanComment);
    curtidasComentarios.appendChild(comentarios);

    let compartilhamentos = document.createElement("div");
    compartilhamentos.setAttribute("class", "compartilhamentos");
    compartilhamentos.onclick = () => {
        showShares(result);
    }

    let pShares = document.createElement("p");
    pShares.setAttribute("class", "share");
    pShares.innerHTML = result.t_shares;

    let spanShare = document.createElement("span");
    spanShare.innerHTML = "Compartilhamentos"

    compartilhamentos.appendChild(pShares);
    compartilhamentos.appendChild(spanShare);
    curtidasComentarios.appendChild(compartilhamentos);

    let hr = document.createElement("hr");

    let botoesPublication = document.createElement("div");
    botoesPublication.setAttribute("class", "botoes-publication");

    let buttonLike = document.createElement("button");
    buttonLike.setAttribute("type", "button");
    if (result.li_post_id == null) {
        buttonLike.innerHTML = "Curtir";
    } else {
        buttonLike.innerHTML = "Descurtir";
    }
    buttonLike.onclick = () => {
        likeDeslike(buttonLike, result);
    }

    let btnComment = document.createElement("button");
    btnComment.setAttribute("type", "button");
    btnComment.setAttribute("class", "btnComment");
    btnComment.innerHTML = "Comentar";
    btnComment.onclick = () => {
        showComments(btnComment, result);
    }

    let btnShare = document.createElement("button");
    btnShare.setAttribute("type", "button");
    btnShare.innerHTML = "Compartilhar";
    btnShare.onclick = () => {
        sharePost(btnShare, result);
    }

    botoesPublication.appendChild(buttonLike);
    botoesPublication.appendChild(btnComment);
    botoesPublication.appendChild(btnShare);

    let commentArea = document.createElement("div");
    commentArea.setAttribute("class", "commentArea");

    let commentar = document.createElement("div");
    commentar.setAttribute("class", "commentar");

    let txtTextAreaComment = document.createElement("textarea");
    txtTextAreaComment.setAttribute("class", "txtTextAreaComment");
    txtTextAreaComment.placeholder = "Escreva um comentário";
    txtTextAreaComment.onkeyup = () => {
        autoResize(txtTextAreaComment)
    }

    let btnEnviarComment = document.createElement("button");
    btnEnviarComment.setAttribute("class", "btnEnviarComment");
    btnEnviarComment.setAttribute("type", "button");
    btnEnviarComment.innerHTML = "Enviar";
    btnEnviarComment.onclick = () => {
        commentPost(btnEnviarComment, result);
    }

    let area = document.createElement("div");
    area.setAttribute("class", "area");

    commentar.appendChild(txtTextAreaComment);
    commentar.appendChild(btnEnviarComment);
    commentArea.appendChild(commentar);
    commentArea.appendChild(area);

    publication.appendChild(publicationPost);
    publication.appendChild(curtidasComentarios);
    publication.appendChild(hr);
    publication.appendChild(botoesPublication);
    publication.appendChild(commentArea);

    areaPost.appendChild(publication);
}

function createComment(result, area) {
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

        let perfil_like_share = delet.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.firstElementChild;
        let spanComment;

        if (perfil_like_share.classList.contains("perfilshare") || perfil_like_share.classList.contains("perfil_like")) {
            spanComment = delet.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[3].children[1].firstChild;
        } else {
            spanComment = delet.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[2].children[1].firstChild;
        }

        let endPoints = `Controllers/delete_comment?id=${commentId}`
        fetch(endPoints)
            .then(res => res.json())
            .then(results => {
                if (results.status == "SUCESS") {
                    spanComment.innerHTML--;
                    itemComment.remove();
                } else {
                    console.log(results['message']);
                }
            });
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

    let itemComment = document.createElement("div");
    itemComment.setAttribute("class","itemComment");

    itemComment.appendChild(perfilComment);
    itemComment.appendChild(ccommentMenuDrop);
    itemComment.appendChild(corpoComment);

    area.appendChild(itemComment);
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

function postModal() {

    const janela = document.getElementById("areaPostModal");
    const btnFechar = document.getElementById("btnFecharPostModal");
    const btnPublicarPost = document.getElementById("btnPublicarPost");

    document.querySelector('.postModal .cabecalhoPostModal h4').innerText = "Criar nova publicação";
    btnPublicarPost.innerHTML = "Publicar";

    janela.classList.remove("esconderPostModal");

    btnPublicarPost.onclick = () =>{
        const userId = document.querySelector("#postForm .userId").value;
        const post = document.querySelector("#postForm textarea").value;
        const fotoUrl = document.querySelector("#postForm .fotoUrl").value;
        const videoUrl = document.querySelector("#postForm .videoUrl").value;
        const endPoint = `Controllers/create_new_post?post=${post}&foto_url=${fotoUrl}&video_url=${videoUrl}&user_id=${userId}`;
    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {
                janela.classList.add("esconderPostModal");
                areaPost.remove();
                getAllUsers();
            } else {
                console.log(results['message']);
            }
        }).catch(error => {
            // Lidar com erros
            console.error('Erro:', error);
        });
    }

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

function editarPost(element, result) {
    let post;
    let perfil_like_share = element.parentElement.parentElement.parentElement.parentElement.firstChild;

    if (perfil_like_share.classList.contains("perfilshare") || perfil_like_share.classList.contains("perfil_like")) {
        post = element.parentElement.parentElement.parentElement.parentElement.children[2].children[1];
    } else {
        post = element.parentElement.parentElement.parentElement.parentElement.children[1].children[1];
    }

    const janela = document.getElementById("areaPostModal");
    const btnFecharPostModal = document.getElementById("btnFecharPostModal");

    document.querySelector('.postModal .cabecalhoPostModal h4').innerText = "Editar publicação";
    document.querySelector("#postForm button").innerHTML = "Salvar";
    document.querySelector("#postForm").action = "Controllers/update_post.php";
    document.getElementById("postId").value = result.id;
    document.querySelector("#postForm textarea").value = post.innerText;

    janela.classList.remove("esconderPostModal");
    janela.classList.add("mostrarPostModal");

    btnFecharPostModal.onclick = function () {
        document.querySelector("#postForm textarea").value = "";
        janela.classList.remove("mostrarPostModal");
        janela.classList.add("esconderPostModal");
    }
}

function excluirPost(publication, result) {
    let endPoint = `Controllers/delete_post.php?id=${result.id}`;
    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {
                publication.remove();
            } else {
                console.log(results['message']);
            }
        }).catch(error => {
            // Lidar com erros
            console.error('Erro:', error);
        });
}

function showLikes(result) {
    const janela = document.getElementById("arealinksCurtidas");
    const btnFechar = document.getElementById("btnFecharCurtidas");

    const totalLikes = document.querySelector(".totalCurtidas span");
    const campo = document.querySelector(".campoCurtidas");

    campo.innerHTML = "";

    let endPoint = `Controllers/get_all_likes/index.php?post_id=${result.id}`;

    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {

                totalLikes.innerText = results['results'].length;

                results['results'].forEach((like) => {

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
            } else {
                console.log(results['message']);
            }
        });

    janela.classList.remove("esconderPostModal");
    janela.classList.add("mostrarPostModal");


    btnFechar.onclick = function () {
        campo.innerHTML = "";
        janela.classList.remove("mostrarPostModal");
        janela.classList.add("esconderPostModal");
    }
}

function showComments(element, result) {
    let janela = element.parentNode.parentNode.lastElementChild;
    let area = element.parentNode.parentNode.lastElementChild.lastElementChild;
    let spanComment = element.parentNode.parentNode.children[2].children[1].firstElementChild;

    janela.classList.toggle("most");

    const endPoint = `Controllers/get_comments?post_id=${result.id}`;
    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {
                area.innerHTML = "";
                results['results'].forEach((result) => {
                    createComment(result, area);
                });

            } else {
                console.log(results['message']);
            }
        }).catch(error => {
            // Lidar com erros
            console.error('Erro:', error);
        });
}

function showShares(result) {
    const janela = document.getElementById("arealinksComp");
    const btnFechar = document.getElementById("btnFecharComp");

    const totalShares = document.querySelector(".totalComp span");
    const campo = document.querySelector(".campoComp");
    const imagem = document.querySelector(".campoComp .perfilComp img");

    campo.innerHTML = "";

    let endPoint = `Controllers/get_all_shares/index.php?post_id=${result.id}`;

    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {

                totalShares.innerText = results['results'].length;

                results['results'].forEach((share) => {

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
            } else {
                console.log(results['message']);
            }
        });

    janela.classList.remove("esconderPostModal");
    janela.classList.add("mostrarPostModal");

    btnFechar.onclick = function () {
        campo.innerHTML = "";
        janela.classList.remove("mostrarPostModal");
        janela.classList.add("esconderPostModal");
    }
}

function likeDeslike(element, result) {
    let perfil_share_like = element.parentElement.parentElement.firstElementChild;
    let elementLikes;

    if (perfil_share_like.classList.contains("perfilshare") || perfil_share_like.classList.contains("perfil_like")) {
        elementLikes = element.parentElement.parentElement.children[3].firstElementChild.firstElementChild;
    } else {
        elementLikes = element.parentElement.parentElement.children[2].firstElementChild.firstElementChild;
    }

    let endPoint = `Controllers/curtir_descurtir.php?user_id=${result.user_id}&post_id=${result.id}`;

    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {

                if (element.innerHTML == "Curtir") {
                    elementLikes.innerHTML++;
                } else if (element.innerHTML == "Descurtir") {
                    elementLikes.innerHTML--;
                }
                element.innerHTML = results["results"];

            } else {
                console.log(results['message']);
            }
        });
}

function sharePost(element, result) {
    const post = document.getElementById('conteudoPost');
    let publication;
    let perfil_like_share = element.parentElement.parentElement.firstElementChild;

    if (perfil_like_share.classList.contains("perfilshare") || perfil_like_share.classList.contains("perfil_like")) {
        publication = element.parentElement.parentElement.children[2];
    } else {
        publication = element.parentElement.parentElement.children[1];
    }

    document.getElementsByClassName('textAreaCompartModal')[0].value = "";
    const janela = document.getElementById("areaCompartModal");
    const postIdCompart = document.getElementById("postIdCompart");
    const btnFechar = document.getElementById("btnFecharCompartModal");
    document.getElementById("rshare").value = "home";

    postIdCompart.value = result.id;
    post.innerHTML = publication.innerHTML;
    janela.classList.remove("esconderPostModal");
    janela.classList.add("mostrarPostModal");

    btnFechar.onclick = function () {
        document.getElementsByClassName('textAreaCompartModal')[0].value = "";
        janela.classList.remove("mostrarPostModal");
        janela.classList.add("esconderPostModal");
    }
}

function commentPost(element, result) {
    let menssage;
    let spanComment;

    let perfil_like_share = element.parentElement.parentElement.parentElement.firstElementChild;

    if (perfil_like_share.classList.contains("perfilshare") || perfil_like_share.classList.contains("perfil_like")) {
        spanComment = element.parentNode.parentNode.parentNode.children[3].children[1].firstElementChild;
    } else {
        spanComment = element.parentNode.parentNode.parentNode.children[2].children[1].firstElementChild;
    }

    area = element.parentNode.parentNode.lastElementChild;
    menssage = element.parentNode.firstElementChild.value.replaceAll('\n', '<br/>');
    element.parentNode.firstElementChild.value = "";
    element.parentNode.firstElementChild.style.height = "15px";

    let endPoint = `Controllers/create_new_comment?comment=${menssage}&user_id=${userId}&post_id=${result.id}`;

    if (menssage != "") {
        spanComment.innerHTML++;

        fetch(endPoint)
            .then(res => res.json())
            .then(results => {
                if (results.status == "SUCESS") {
                    area.innerHTML = "";
                    results['results'].forEach((result) => {
                        createComment(result, area);
                    });
                } else {
                    console.log(results['message']);
                }
            });
    }
}

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

            let endPoint = `Controllers/create_new_messager_chat?messeger=${chatMessage.value}&user_id=${userId}&to_user_id=${fromId}`;

            chatMessage.value = "";

            fetch(endPoint)
                .then(res => res.json())
                .then(results => {
                    if (results.status == "SUCESS") {
                        msg = JSON.stringify(msg); //converte para json
                        conn.send(msg);
                    } else {
                        console.log(results['message']);
                    }
                });
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

    let endPoint = `Controllers/update_messeger_chat?from_id=${fromId}&user_id=${userId}`;
    fetch(endPoint);

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

    let endPoint = `Controllers/get_all_status?user_id=${userId}`;

    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {
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
                        if (count == 0) {
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
            } else {
                console.log(results['message']);
            }
        });
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

        let endPoint = `Controllers/get_messager_chat?user_id=${userId}&to_user_id=${fromId}`;

        fetch(endPoint)
            .then(res => res.json())
            .then(results => {
                if (results.status == "SUCESS") {
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
                } else {
                    console.log(results['message']);
                }
            });
    }
}

// =======================================================================================================