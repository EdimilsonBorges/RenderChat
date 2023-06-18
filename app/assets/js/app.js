// Conexão do chat =====================================================================================
//const conn = new WebSocket('ws:localhost:8080/wss');
const conn = new WebSocket('ws:192.168.0.110:8080/wss');
const userId = document.getElementById("principal").dataset.userid;
const nameC = document.getElementById("principal").dataset.namec;
const photo = document.getElementById("principal").dataset.photo;
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
        }
    } else if (data.userId != userId) {
        const dados = JSON.stringify(data);
        showChatMessage(dados, "other", userId);
    } else {
        const dados = JSON.stringify(data);
        showChatMessage(dados, "me", userId);
    }
};

// Funções da página =====================================================================================

// ocultar menu se clicar fora do elemento
window.onclick = function (event) {
    if (!event.target.matches('.btnPostMenuDrop')) {
        const elements = document.getElementsByClassName("linksPostMenuDrop");

        for (let i = 0; i < elements.length; i++) {
            let aberto = elements[i];
            if (aberto.classList.contains("visivel")) {
                aberto.classList.remove("visivel");
            }
        }
    }
}

let carregando = false;
let postPosition = -1;
let limit = 10;
let offset = 0;
let fim = false;

function resetDados() {
    carregando = false;
    postPosition = -1;
    limit = 10;
    offset = 0;
    fim = false;
}

const pagina = document.getElementById("posts").dataset.pagina;

getAllUsers(limit, offset, pagina);

if (!fim) {
    window.addEventListener('scroll', () => {

        const elemento = document.getElementsByClassName("publication")[postPosition];
        if (elemento != null) {
            let rect = elemento.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                if (!carregando) {
                    offset += limit;
                    console.log("Carregando....");
                    getAllUsers(limit, offset, pagina);
                } else {
                    console.log("Carregou!!!");
                }
            }
        }
    });
}

function getAllUsers(limit, offset, pagina) {

    const posts = document.getElementById("posts");

    const areaPost = document.createElement("div");
    areaPost.setAttribute("class", "areaPost");
    areaPost.setAttribute("id", "areaPost");


    posts.appendChild(areaPost);

    carregando = true;

    let endPoint;

    const urlAtual = window.location.href;
    const urlClass = new URL(urlAtual);
    let perfilId = urlClass.searchParams.get("id");

    if (pagina == "home") {
        endPoint = `Controllers/get_all_posts?user_id=${userId}&limit=${limit}&offset=${offset}`;
    } else if (pagina == "perfil") {
        if(perfilId==null){
            endPoint = `Controllers/get_post_user?user_id=${userId}&limit=${limit}&offset=${offset}`;
        }else{
            endPoint = `Controllers/get_post_user?user_id=${perfilId}&limit=${limit}&offset=${offset}`;
        }
    }
    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {
                results['results'].forEach((result) => {
                    createPost(result);
                    postPosition++;
                    carregando = false;
                    if (results['results'].length < limit) {
                        fim = true;
                    }
                });

            } else {
                console.log(results['message']);
            }
        }).catch(error => {
            // Lidar com erros
            console.error('Erro:', error);
        });
}

function createPerfilShare(result, publication) {

    const perfil_share = document.createElement("header");
    perfil_share.setAttribute("class", "perfil_share");
    perfil_share.onclick = () => {
        showShares(result);
    }
    const div = document.createElement("div");

    const imgShare = document.createElement("img");
    if (result.sh_photo_url != null) {
        imgShare.setAttribute("src", `assets/images/${result.sh_photo_url}`);
    } else {
        imgShare.setAttribute("src", `assets/images/sem-foto.jpg`);
    }

    const pMensagemShare = document.createElement("p");

    if (result.t_shares <= 1) {
        pMensagemShare.innerHTML = `${result.sh_first_name} ${result.sh_last_name} compartilhou isso!`;
    } else if (result.t_shares <= 2) {
        pMensagemShare.innerHTML = `${result.sh_first_name} ${result.sh_last_name} e outras ${result.t_shares - 1}  pessoa compartilhou isso!`;
    } else {
        pMensagemShare.innerHTML = `${result.sh_first_name} ${result.sh_last_name} e outras ${result.t_shares - 1}  pessoas compartilhou isso!`;
    }

    div.appendChild(imgShare);
    div.appendChild(pMensagemShare);
    perfil_share.appendChild(div);
    publication.appendChild(perfil_share);
}

function createPerfilLike(result, publication) {
    const perfil_like = document.createElement("header");
    perfil_like.setAttribute("class", "perfil_like");
    perfil_like.onclick = () => {
        showLikes(result);
    }
    const div = document.createElement("div");

    const imgLike = document.createElement("img");

    if (result.lik_photo_url != null) {
        imgLike.setAttribute("src", `assets/images/${result.lik_photo_url}`);
    } else {
        imgLike.setAttribute("src", `assets/images/sem-foto.jpg`);
    }

    const pMensagemLike = document.createElement("p");

    if (result.t_likes <= 1) {
        pMensagemLike.innerHTML = `${result.lik_first_name} ${result.lik_last_name} curtiu isso!`;
    } else if (result.t_likes <= 2) {
        pMensagemLike.innerHTML = `${result.lik_first_name} ${result.lik_last_name} e outras ${result.t_likes - 1}  pessoa curtiu isso!`;
    } else {
        pMensagemLike.innerHTML = `${result.lik_first_name} ${result.lik_last_name} e outras ${result.t_likes - 1}  pessoas curtiu isso!`;
    }

    div.appendChild(imgLike);
    div.appendChild(pMensagemLike);
    perfil_like.appendChild(div);
    publication.appendChild(perfil_like);
}

function createPost(result) {

    const areaPost = document.getElementById("areaPost");

    const publication = document.createElement("section");
    publication.setAttribute("class", "publication");
    publication.setAttribute("data-postid", result.id);
    publication.setAttribute("data-postuserid", result.user_id);

    if (result.sh_user_id != null) {
        createPerfilShare(result, publication);
    } else if (result.lik_user_id != null) {
        createPerfilLike(result, publication);
    }

    const postMenuDrop = document.createElement("div");
    postMenuDrop.setAttribute("class", "postMenuDrop");

    const btnPostMenuDrop = document.createElement("button");
    btnPostMenuDrop.setAttribute("class", "btnPostMenuDrop");
    btnPostMenuDrop.innerHTML = "...";
    btnPostMenuDrop.onclick = () => {
        if (userId == result.user_id) {
            linksPostMenuDrop.classList.toggle("visivel");
        }
    }

    const navLinks = document.createElement("nav");
    navLinks.setAttribute("class", "navLinks");

    const linksPostMenuDrop = document.createElement("div");
    linksPostMenuDrop.setAttribute("class", "linksPostMenuDrop");

    const imgEditar = document.createElement("img");
    imgEditar.setAttribute("class", "imgDelete");
    imgEditar.setAttribute("src", "./assets/icons/edit.svg");

    const linkEditar = document.createElement("a");
    linkEditar.onclick = () => {
        editarPost(linkEditar, result);
    }

    linkEditar.appendChild(imgEditar);
    linkEditar.innerHTML += "Editar";

    const imgDelete = document.createElement("img");
    imgDelete.setAttribute("class", "imgDelete");
    imgDelete.setAttribute("src", "./assets/icons/delete.svg");

    const linkExcluir = document.createElement("a");
    linkExcluir.onclick = () => {
        excluirPost(publication, result);
    }

    linkExcluir.appendChild(imgDelete);
    linkExcluir.innerHTML += "Excluir";

    linksPostMenuDrop.appendChild(linkEditar);
    linksPostMenuDrop.appendChild(linkExcluir);
    navLinks.appendChild(linksPostMenuDrop);
    postMenuDrop.appendChild(btnPostMenuDrop);
    postMenuDrop.appendChild(navLinks);
    publication.appendChild(postMenuDrop);

    publicationPost = document.createElement("div");
    publicationPost.setAttribute("class", "publicationPost");

    const perfil = document.createElement("header");
    perfil.setAttribute("class", "perfil");

    const div = document.createElement("div");

    const imgPerf = document.createElement("img");

    if (result.photo_url != null) {
        imgPerf.setAttribute("src", `assets/images/${result.photo_url}`);
    } else {
        imgPerf.setAttribute("src", `assets/images/sem-foto.jpg`);
    }

    div.appendChild(imgPerf);
    perfil.appendChild(div);

    cabecalho = document.createElement("div");
    cabecalho.setAttribute("class", "cabecalho");

    postCabecalho = document.createElement("div");
    postCabecalho.setAttribute("class", "postCabecalho");

    aNomeUserPost = document.createElement("a");
    aNomeUserPost.setAttribute("href", `/upper/app/?r=perfil&id=${publication.dataset.postuserid}`);
    aNomeUserPost.innerHTML = `${result.first_name} ${result.last_name}`;

    h5 = document.createElement("h5");
    h5.innerHTML = result.created_at;

    postCabecalho.appendChild(aNomeUserPost);
    cabecalho.appendChild(postCabecalho);
    cabecalho.appendChild(h5);
    perfil.appendChild(cabecalho);

    divPost = document.createElement("div");
    pPost = document.createElement("p");
    pPost.setAttribute("class", "pPost");
    pPost.innerHTML = result.post;

    divPost.appendChild(pPost);
    publicationPost.appendChild(perfil);
    publicationPost.appendChild(divPost);

    const curtidasComentarios = document.createElement("div");
    curtidasComentarios.setAttribute("class", "curtidas-comentarios");

    const curtidas = document.createElement("div");
    curtidas.setAttribute("class", "curtidas");
    curtidas.onclick = () => {
        showLikes(result);
    }

    const pLike = document.createElement("p");
    pLike.setAttribute("class", "like");
    pLike.innerHTML = result.t_likes;

    const spanLike = document.createElement("span");
    spanLike.innerHTML = "Curtidas"

    curtidas.appendChild(pLike);
    curtidas.appendChild(spanLike);
    curtidasComentarios.appendChild(curtidas);

    const comentarios = document.createElement("div");
    comentarios.setAttribute("class", "comentarios");
    comentarios.onclick = () => {
        showComments(comentarios, result);
    }

    const pComment = document.createElement("p");
    pComment.setAttribute("class", "spanComment");
    pComment.innerHTML = result.t_comments;

    const spanComment = document.createElement("span");
    spanComment.innerHTML = "Comentários"

    comentarios.appendChild(pComment);
    comentarios.appendChild(spanComment);
    curtidasComentarios.appendChild(comentarios);

    const compartilhamentos = document.createElement("div");
    compartilhamentos.setAttribute("class", "compartilhamentos");
    compartilhamentos.onclick = () => {
        showShares(result);
    }

    const pShares = document.createElement("p");
    pShares.setAttribute("class", "share");
    pShares.innerHTML = result.t_shares;

    const spanShare = document.createElement("span");
    spanShare.innerHTML = "Compartilhamentos"

    compartilhamentos.appendChild(pShares);
    compartilhamentos.appendChild(spanShare);
    curtidasComentarios.appendChild(compartilhamentos);

    const hr = document.createElement("hr");

    const botoesPublication = document.createElement("div");
    botoesPublication.setAttribute("class", "botoes-publication");

    const buttonLike = document.createElement("button");
    buttonLike.setAttribute("type", "button");

    const imgLike = document.createElement("img");
    imgLike.setAttribute("class", "imgLike");

    buttonLike.innerHTML = "Curtir";

    if (result.li_post_id == null) {
        imgLike.setAttribute("src", "./assets/icons/like.svg");
        publication.setAttribute("data-like", "no");
    } else {
        imgLike.setAttribute("src", "./assets/icons/deslike.svg");
        publication.setAttribute("data-like", "yes");
        buttonLike.style.color = "#090";
    }
    buttonLike.appendChild(imgLike);
    buttonLike.onclick = () => {
        likeDeslike(buttonLike, result, imgLike, publication);
    }

    const btnComment = document.createElement("button");
    btnComment.setAttribute("type", "button");
    btnComment.setAttribute("class", "btnComment");

    const imgComment = document.createElement("img");
    imgComment.setAttribute("class", "imgComment");
    imgComment.setAttribute("src", "./assets/icons/comment.svg");

    btnComment.innerHTML = "Comentar";

    btnComment.onclick = () => {
        showComments(btnComment, result);
    }

    btnComment.appendChild(imgComment);

    const btnShare = document.createElement("button");
    btnShare.setAttribute("type", "button");

    const imgShare = document.createElement("img");
    imgShare.setAttribute("class", "imgShare");
    imgShare.setAttribute("src", "./assets/icons/share.svg");

    btnShare.innerHTML = "Compartilhar";

    btnShare.onclick = () => {
        sharePost(btnShare, result);
    }
    btnShare.appendChild(imgShare);

    botoesPublication.appendChild(buttonLike);
    botoesPublication.appendChild(btnComment);
    botoesPublication.appendChild(btnShare);

    const commentArea = document.createElement("div");
    commentArea.setAttribute("class", "commentArea");

    const commentar = document.createElement("div");
    commentar.setAttribute("class", "commentar");

    const txtTextAreaComment = document.createElement("textarea");
    txtTextAreaComment.setAttribute("class", "txtTextAreaComment");
    txtTextAreaComment.setAttribute("id", `${result.id}comment`);
    txtTextAreaComment.placeholder = "Escreva um comentário";

    txtTextAreaComment.addEventListener("input", e => {
        txtTextAreaComment.style.height = "1px";
        let scHeight = e.target.scrollHeight;
        console.log(scHeight);
        txtTextAreaComment.style.height = `${scHeight - 20}px`;
    });

    const imgEnviarComment = document.createElement("img");
    imgEnviarComment.setAttribute("class", "imgEnviarComment");
    imgEnviarComment.setAttribute("src", "./assets/icons/send.svg");

    const btnEnviarComment = document.createElement("button");
    btnEnviarComment.setAttribute("class", "btnEnviarComment");
    btnEnviarComment.setAttribute("type", "button");
    btnEnviarComment.onclick = () => {
        commentPost(btnEnviarComment, result);
    }
    btnEnviarComment.innerHTML = "Enviar";
    btnEnviarComment.appendChild(imgEnviarComment);

    const area = document.createElement("div");
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
    const commentUserId = result['user_id'];
    const commentId = result['id'];

    const perfilComment = document.createElement("header");
    perfilComment.setAttribute("class", "perfil_comment");

    const div = document.createElement("div");

    const img = document.createElement("img");
    if (result.co_photo_url != null) {
        img.src = `assets/images/${result.co_photo_url}`;
    } else {
        img.src = "assets/images/sem-foto.jpg";
    }

    const ccommentMenuDrop = document.createElement("div");
    ccommentMenuDrop.setAttribute("class", "commentMenuDrop");

    const btnCommentMenuDrop = document.createElement("button");
    btnCommentMenuDrop.setAttribute("class", "btnCommentMenuDrop");
    btnCommentMenuDrop.id = "btnCommentMenuDrop";
    btnCommentMenuDrop.innerText = "...";
    btnCommentMenuDrop.onclick = function () {
        commentMenuDrop(commentId, commentUserId, userId);
    }

    const navLinksComment = document.createElement("nav");
    navLinksComment.setAttribute("class", "navLinksComment navLinksCommentInvisible");
    navLinksComment.id = commentId;

    const linksCommentMenuDrop = document.createElement("div");
    linksCommentMenuDrop.setAttribute("class", "linksCommentMenuDrop");

    const delet = document.createElement("a");
    delet.id = "delet";
    delet.innerText = "Excluir";
    delet.onclick = function () {

        const perfil_like_share = delet.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.firstElementChild;
        let spanComment;

        if (perfil_like_share.classList.contains("perfil_share") || perfil_like_share.classList.contains("perfil_like")) {
            spanComment = delet.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[3].children[1].firstChild;
        } else {
            spanComment = delet.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[2].children[1].firstChild;
        }

        const endPoints = `Controllers/delete_comment?id=${commentId}`
        fetch(endPoints)
            .then(res => res.json())
            .then(results => {
                if (results.status == "SUCESS") {
                    spanComment.innerHTML--;
                    itemComment.remove();
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    const corpoComment = document.createElement("div");
    corpoComment.setAttribute("class", "corpo_comment");

    const nomePerf = document.createElement("p");
    nomePerf.setAttribute("class", "nomePerf");
    nomePerf.innerText = `${result['co_first_name']} ${result['co_last_name']}`;

    const p = document.createElement("p");
    p.innerHTML = result['comment'];

    div.appendChild(img);
    perfilComment.appendChild(div);

    linksCommentMenuDrop.appendChild(delet);
    navLinksComment.appendChild(linksCommentMenuDrop);
    ccommentMenuDrop.appendChild(btnCommentMenuDrop);
    ccommentMenuDrop.appendChild(navLinksComment);

    corpoComment.appendChild(nomePerf);
    corpoComment.appendChild(p);

    const itemComment = document.createElement("div");
    itemComment.setAttribute("class", "itemComment");

    itemComment.appendChild(perfilComment);
    itemComment.appendChild(ccommentMenuDrop);
    itemComment.appendChild(corpoComment);

    area.appendChild(itemComment);
}

function commentMenuDrop(commentId, commentUser, user) {

    const janela = document.getElementById(commentId);
    const janelas = document.getElementsByClassName("navLinksComment");

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

function postModal() {

    const janela = document.getElementById("areaPostModal");
    const btnFechar = document.getElementById("btnFecharPostModal");
    const btnPublicarPost = document.getElementById("btnPublicarPost");
    const areaPost = document.getElementById("areaPost");

    document.querySelector('.postModal .cabecalhoPostModal h4').innerText = "Postar";
    btnPublicarPost.innerHTML = "Publicar";

    janela.classList.remove("esconderPostModal");

    btnPublicarPost.onclick = () => {
        const userId = document.querySelector("#postModal .userId").value;
        const post = document.querySelector("#postModal textarea").value.replaceAll('\n', '<br/>');
        const fotoUrl = document.querySelector("#postModal .fotoUrl").value;
        const videoUrl = document.querySelector("#postModal .videoUrl").value;

        const endPoint = `Controllers/create_new_post?post=${post}&foto_url=${fotoUrl}&video_url=${videoUrl}&user_id=${userId}`;
        fetch(endPoint)
            .then(res => res.json())
            .then(results => {
                document.querySelector("#postModal textarea").value = "";
                if (results.status == "SUCESS") {
                    janela.classList.add("esconderPostModal");
                    areaPost.remove();
                    resetDados();
                    getAllUsers(limit, offset, pagina);
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    btnFechar.onclick = function () {
        document.querySelector("#postModal textarea").value = "";
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
const btnPublicarHome = document.getElementById("btnPublicarHome");
if (btnPublicarHome != null) {
    btnPublicarHome.addEventListener("click", () => {
        postModal();
    });
} else {
    // Publicar um Post (Página Perfil)
    const btnPublicarPerfil = document.getElementById("btnPublicarPerfil");
    btnPublicarPerfil.addEventListener("click", () => {
        postModal();
    });
}

function editarPost(element, result) {
    let post;
    const perfil_like_share = element.parentElement.parentElement.parentElement.parentElement.firstChild;

    if (perfil_like_share.classList.contains("perfil_share") || perfil_like_share.classList.contains("perfil_like")) {
        post = element.parentElement.parentElement.parentElement.parentElement.children[2].children[1];
    } else {
        post = element.parentElement.parentElement.parentElement.parentElement.children[1].children[1];
    }

    const janela = document.getElementById("areaPostModal");
    const btnFecharPostModal = document.getElementById("btnFecharPostModal");
    const btnEditPost = document.getElementById("btnPublicarPost");

    document.querySelector('.postModal .cabecalhoPostModal h4').innerText = "Editar publicação";
    document.querySelector("#postModal button").innerHTML = "Salvar";
    document.getElementById("postId").value = result.id;
    const textArea = document.querySelector("#postModal textarea");
    textArea.value = post.innerText;

    janela.classList.remove("esconderPostModal");
    janela.classList.add("mostrarPostModal");

    btnEditPost.onclick = () => {
        const postId = element.parentNode.parentNode.parentNode.parentNode.dataset.postid;
        const postUserId = element.parentNode.parentNode.parentNode.parentNode.dataset.postuserid;
        const areaPost = document.getElementById("areaPost");
        const post = document.querySelector("#postModal textarea").value.replaceAll('\n', '<br/>');
        const fotoUrl = document.querySelector("#postModal .fotoUrl").value;
        const videoUrl = document.querySelector("#postModal .videoUrl").value;
        const endPoint = `Controllers/update_post?post=${post}&foto_url=${fotoUrl}&video_url=${videoUrl}&post_id=${postId}&post_user_id=${postUserId}&user_id=${userId}`;
        fetch(endPoint)
            .then(res => res.json())
            .then(results => {
                document.querySelector("#postModal textarea").value = "";
                if (results.status == "SUCESS") {
                    janela.classList.add("esconderPostModal");
                    areaPost.remove();
                    resetDados();
                    getAllUsers(limit, offset, pagina);
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    btnFecharPostModal.onclick = () => {
        document.querySelector("#postModal textarea").value = "";
        janela.classList.remove("mostrarPostModal");
        janela.classList.add("esconderPostModal");
    }
}

function excluirPost(publication, result) {
    const endPoint = `Controllers/delete_post.php?id=${result.id}`;
    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {
                publication.remove();
                postPosition -= 1;
            } else {
                console.log(results['message']);
            }
        }).catch(error => {
            console.error('Erro:', error);
        });
}

function showLikes(result) {
    const janela = document.getElementById("arealinksCurtidas");
    const btnFechar = document.getElementById("btnFecharCurtidas");

    const totalLikes = document.querySelector(".totalCurtidas span");
    const campo = document.querySelector(".campoCurtidas");

    campo.innerHTML = "";

    const endPoint = `Controllers/get_all_likes/index.php?post_id=${result.id}`;

    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {

                totalLikes.innerText = results['results'].length;

                results['results'].forEach((like) => {

                    const perfilCurtidas = document.createElement("div");
                    perfilCurtidas.setAttribute("class", "perfilCurtidas");

                    const img = document.createElement("img");

                    if (like['photo_url'] != null) {
                        img.src = `assets/images/${like['photo_url']}`;
                    } else {
                        img.src = "assets/images/sem-foto.jpg";
                    }

                    const h5 = document.createElement("h5");
                    h5.innerText = `${like['first_name']} ${like['last_name']}`;

                    const btnAdicionar = document.createElement("button");
                    btnAdicionar.type = "button";
                    btnAdicionar.innerText = "Adicionar";

                    const hr = document.createElement("hr");

                    perfilCurtidas.appendChild(img);
                    perfilCurtidas.appendChild(h5);
                    perfilCurtidas.appendChild(btnAdicionar);

                    campo.appendChild(perfilCurtidas);
                    campo.appendChild(hr);
                });
            } else {
                console.log(results['message']);
            }
        }).catch(error => {
            // Lidar com erros
            console.error('Erro:', error);
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
    const janela = element.parentNode.parentNode.lastElementChild;
    const area = element.parentNode.parentNode.lastElementChild.lastElementChild;

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

    const endPoint = `Controllers/get_all_shares/index.php?post_id=${result.id}`;

    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {

                totalShares.innerText = results['results'].length;

                results['results'].forEach((share) => {

                    const perfilComp = document.createElement("div");
                    perfilComp.setAttribute("class", "perfilComp");

                    const img = document.createElement("img");

                    if (share['photo_url'] != null) {
                        img.src = `assets/images/${share['photo_url']}`;
                    } else {
                        img.src = "assets/images/sem-foto.jpg";
                    }

                    const h5 = document.createElement("h5");
                    h5.innerText = `${share['first_name']} ${share['last_name']}`;

                    const btnAdicionar = document.createElement("button");
                    btnAdicionar.type = "button";
                    btnAdicionar.innerText = "Adicionar";

                    const hr = document.createElement("hr");

                    perfilComp.appendChild(img);
                    perfilComp.appendChild(h5);
                    perfilComp.appendChild(btnAdicionar);

                    campo.appendChild(perfilComp);
                    campo.appendChild(hr);
                });
            } else {
                console.log(results['message']);
            }
        }).catch(error => {
            // Lidar com erros
            console.error('Erro:', error);
        });

    janela.classList.remove("esconderPostModal");
    janela.classList.add("mostrarPostModal");

    btnFechar.onclick = function () {
        campo.innerHTML = "";
        janela.classList.remove("mostrarPostModal");
        janela.classList.add("esconderPostModal");
    }
}

function likeDeslike(element, result, imgLike, publication) {
    const perfil_share_like = element.parentElement.parentElement.firstElementChild;
    let elementLikes;

    if (perfil_share_like.classList.contains("perfil_share") || perfil_share_like.classList.contains("perfil_like")) {
        elementLikes = element.parentNode.parentNode.children[3].firstElementChild.firstElementChild;
    } else {
        elementLikes = element.parentNode.parentNode.children[2].firstElementChild.firstElementChild;
    }

    const endPoint = `Controllers/create_new_like.php?user_id=${userId}&post_id=${result.id}`;

    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {

                if (publication.dataset.like == "no") {
                    elementLikes.innerHTML++;
                    imgLike.src = "./assets/icons/deslike.svg";
                    element.style.color = "#090";
                    publication.setAttribute("data-like", "yes");
                } else if (publication.dataset.like == "yes") {
                    elementLikes.innerHTML--;
                    imgLike.src = "./assets/icons/like.svg";
                    element.style.color = "#444";
                    publication.setAttribute("data-like", "no");
                }

            } else {
                console.log(results['message']);
            }
        }).catch(error => {
            // Lidar com erros
            console.error('Erro:', error);
        });
}

function sharePost(element, result) {
    const post = document.getElementById('conteudoPost');
    let publication;
    const perfil_like_share = element.parentElement.parentElement.firstElementChild;

    if (perfil_like_share.classList.contains("perfil_share") || perfil_like_share.classList.contains("perfil_like")) {
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

    const perfil_like_share = element.parentElement.parentElement.parentElement.firstElementChild;

    if (perfil_like_share.classList.contains("perfil_share") || perfil_like_share.classList.contains("perfil_like")) {
        spanComment = element.parentNode.parentNode.parentNode.children[3].children[1].firstElementChild;
    } else {
        spanComment = element.parentNode.parentNode.parentNode.children[2].children[1].firstElementChild;
    }

    area = element.parentNode.parentNode.lastElementChild;
    menssage = element.parentNode.firstElementChild.value.replaceAll('\n', '<br/>');
    element.parentNode.firstElementChild.value = "";
    element.parentNode.firstElementChild.style.height = "15px";

    const endPoint = `Controllers/create_new_comment?comment=${menssage}&user_id=${userId}&post_id=${result.id}`;

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
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }
}

// funções para chat ==========================================================================

function enviarMessageChat(event, userId, fromId) {

    if ((event.keyCode == 13) || (event.keyCode == null)) {

        const chatMessage = document.getElementById(`chat${fromId}`);

        if (chatMessage.value != "") {

            let msg = { // cria um objeto msg
                'userId': userId,
                'fromId': fromId,
                'name': nameC,
                'photo': photo,
                'message': chatMessage.value
            }

            const endPoint = `Controllers/create_new_messager_chat?messeger=${chatMessage.value}&user_id=${userId}&to_user_id=${fromId}`;

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
                }).catch(error => {
                    // Lidar com erros
                    console.error('Erro:', error);
                });
        }
    }
}

function showChatMessage(msg, user) {

    msg = JSON.parse(msg);

    if (user == "me") {

        const areaMenssage = document.getElementById(msg.userId + msg.fromId);

        const caixaEu = document.createElement('div');
        caixaEu.setAttribute('class', 'caixa-eu');

        const mensagemEu = document.createElement('div');
        mensagemEu.setAttribute('class', 'mensagem-eu');

        const mensagemEup = document.createElement('p');
        mensagemEup.textContent = msg.message;

        const visto = document.createElement('div');
        visto.setAttribute("class", "visto");
        visto.style = "width: 10px; height: 10px; background-color: #0f0; border-radius: 50%; margin-top: 16px; margin-left: -18px;";

        const nVisto = document.createElement('div');
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
        const areaMenssage = document.getElementById(msg.fromId + msg.userId);
        openChat(msg.userId, msg.name, msg.photo, true);

        if (areaMenssage != null) {
            receberMensagemChat(msg);
        }

        areaMenssage.scrollTop = areaMenssage.scrollHeight;

    }
}

const receberMensagemChat = (msg) => {

    const areaMenssage = document.getElementById(msg.fromId + msg.userId);

    const caixaOutro = document.createElement('div');
    caixaOutro.setAttribute('class', 'caixa-outro');

    const mensagemOutro = document.createElement('div');
    mensagemOutro.setAttribute('class', 'mensagem-outro');

    const mensagemOutrop = document.createElement('p');
    mensagemOutrop.textContent = msg.message;

    mensagemOutro.appendChild(mensagemOutrop);
    caixaOutro.appendChild(mensagemOutro);
    areaMenssage.appendChild(caixaOutro);
}

document.getElementById("cabecalhoBatePapoPrincipal").onclick = function () {

    ocultarDesocultarBatePapo();
}

function marcarChatComoLido(fromId) {

    const endPoint = `Controllers/update_messeger_chat?from_id=${fromId}&user_id=${userId}`;
    fetch(endPoint)
        .then(res => res.json())
        .then(results => {
            if (results.status == "SUCESS") {
                // atualiza para visto em tempo real
                let read = { // cria um objeto msg
                    'userId': userId,
                    'fromId': fromId,
                    'read_at': Date(),
                }

                read = JSON.stringify(read); //converte para json
                conn.send(read);
            } else {
                console.log(results['message']);
            }
        }).catch(error => {
            // Lidar com erros
            console.error('Erro:', error);
        });
}

function ocultarDesocultarBatePapo() {

    const batepapo = document.getElementById("batePapo");

    if (batepapo.style.height == "75vh") {
        batepapo.style.height = "57px";
    } else if (batepapo.style.height < "60px") {
        batepapo.style.height = "75vh";
    }
}

function carregarUserChat() {

    const endPoint = `Controllers/get_all_status?user_id=${userId}`;

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

                    const nomeCompleto = `${result['first_name']} ${result['last_name']}`;
                    const itemChat = document.createElement("section");
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

                    const div = document.createElement("div");

                    const imgPerfil = document.createElement("img");
                    if (result['photo_url'] != null) {
                        imgPerfil.src = `assets/images/${result['photo_url']}`;
                    } else {
                        imgPerfil.src = "assets/images/sem-foto.jpg";
                    }

                    const statu = document.createElement("div");

                    if (onlines.includes(result['id'])) {
                        statu.setAttribute("class", "online");
                    } else {
                        statu.setAttribute("class", "offline");
                    }

                    const mensagem = document.createElement("div");
                    mensagem.setAttribute("class", "mensagem");

                    const nome = document.createElement("h3");
                    nome.innerText = nomeCompleto;

                    const historico = document.createElement("p");
                    historico.id = `his${result['id']}`;
                    if (result['messeger'] != undefined) {
                        historico.innerText = result['messeger'];
                    } else {
                        historico.innerText = "Sem nova mensagem";
                    }


                    const hr = document.createElement("hr");

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
        }).catch(error => {
            // Lidar com erros
            console.error('Erro:', error);
        });
}

function openChat(fromId, nomeCompleto, perfImg, online) {

    marcarChatComoLido(fromId);

    const myElement = document.getElementById(userId + fromId);

    if (myElement == null) {

        const areaChat = document.getElementById("area-chat");

        const batePapoPerfil = document.createElement('section');
        batePapoPerfil.setAttribute('class', 'bate-papo-perfil');
        batePapoPerfil.style = 'height: 75vh';

        const headerPapoPerfil = document.createElement('header');
        headerPapoPerfil.setAttribute('class', 'perfil-bate-papo-perfil');
        headerPapoPerfil.id = "cabecalhoBatePapo";

        headerPapoPerfil.onclick = function () {
            areaChat.removeChild(batePapoPerfil);
        }

        const div = document.createElement('div');

        const img = document.createElement('img');
        if (perfImg != null) {
            img.src = `assets/images/${perfImg}`;
        } else {
            img.src = "assets/images/sem-foto.jpg";
        }

        const status = document.createElement('div');

        if (online) {
            status.setAttribute("class", "online");
        } else {
            status.setAttribute("class", "offline");
        }

        const div2 = document.createElement('div');

        const h3 = document.createElement('h3');
        h3.innerText = nomeCompleto;

        const hr = document.createElement('hr');

        div2.appendChild(h3);
        div.appendChild(img);
        div.appendChild(status);
        headerPapoPerfil.appendChild(div);
        headerPapoPerfil.appendChild(div2);
        batePapoPerfil.appendChild(headerPapoPerfil);
        batePapoPerfil.appendChild(hr);

        const conversaBatePapoPerfil = document.createElement("section");
        conversaBatePapoPerfil.setAttribute("class", "conversa-bate-papo-perfil");
        conversaBatePapoPerfil.id = userId + fromId;

        const submitBatePapo = document.createElement("div");
        submitBatePapo.setAttribute("class", "submit-bate-papo");
        submitBatePapo.id = "submit-bate-papo";

        const input = document.createElement("input");
        input.setAttribute("class", "chatMessage");
        input.id = `chat${fromId}`;
        input.type = "text";
        input.onkeydown = function (event) {
            enviarMessageChat(event, userId, fromId);
        }

        const btnchat = document.createElement("button");
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

        const endPoint = `Controllers/get_messager_chat?user_id=${userId}&to_user_id=${fromId}`;

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
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }
}

// =======================================================================================================