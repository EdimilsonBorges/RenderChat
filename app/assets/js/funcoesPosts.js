class FuncoesPosts {

  constructor(userId, nameC, photo, pagina) {
    this.userId = userId;
    this.nameC = nameC;
    this.photo = photo;
    this.pagina = pagina;
  }

  carregando = false;
  postPosition = -1;
  limit = 10;
  offset = 0;
  fim = false;

  resetDados = () => {
    this.carregando = false;
    this.postPosition = -1;
    this.limit = 10;
    this.offset = 0;
    this.fim = false;
  }

  lendo = () => {
    const areaPost = document.getElementById("areaPost");
    const custonLoader = document.createElement("div");
    custonLoader.setAttribute("class", "custom-loader");
    areaPost.appendChild(custonLoader);
    console.log("Carregando....");
  }

  carregou = () => {
    const areaPost = document.getElementById("areaPost");
    const custonLoader = document.querySelector(".custom-loader");
    if (custonLoader) {
      areaPost.removeChild(custonLoader);
    }
    console.log("Carregou!!!");
  }

  createFimLoader = () => {
    const areaPost = document.getElementById("areaPost");

    const p = document.createElement("p");
    p.innerHTML = "Sem mais publicações até o momento..."

    const custonLoader = document.createElement("div");
    custonLoader.setAttribute("class", "fim-loader");

    custonLoader.appendChild(p);

    areaPost.appendChild(custonLoader);
    console.log("Fimm!!!");
  }

  getAllPosts = () => {

    if (!this.fim) {
      window.addEventListener('scroll', () => {

        const elemento = document.getElementsByClassName("publication")[this.postPosition];
        if (elemento != null) {
          let rect = elemento.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            if (!this.carregando && this.limit != 0) {
              this.offset += this.limit;
              this.getAllPosts();
            }
          }
        }
      });
    }

    const posts = document.getElementById("posts");

    const areaPost = document.createElement("div");
    areaPost.setAttribute("class", "areaPost");
    areaPost.setAttribute("id", "areaPost");


    posts.appendChild(areaPost);

    if (!this.fim) {
      this.carregando = true;
      this.lendo();
    }

    let endPoint;

    const urlAtual = window.location.href;
    const urlClass = new URL(urlAtual);
    let perfilId = urlClass.searchParams.get("id");

    if (this.pagina == "home") {
      endPoint = `Controllers/get_all_posts?user_id=${this.userId}&limit=${this.limit}&offset=${this.offset}`;
    } else if (this.pagina == "perfil") {
      if (!perfilId) {
        endPoint = `Controllers/get_post_user?user_id=${this.userId}&limit=${this.limit}&offset=${this.offset}`;
      } else {
        endPoint = `Controllers/get_post_user?user_id=${perfilId}&limit=${this.limit}&offset=${this.offset}`;
      }
    }
    fetch(endPoint)
      .then(res => res.json())
      .then(results => {
        if (results.status == "SUCESS") {
          results['results'].forEach((result) => {
            this.createPost(result);
            this.postPosition++;
            this.carregando = false;

            const custonLoader = document.querySelector(".custom-loader");
            if (custonLoader && !this.fim) {
              this.carregou();
            }
          });

          if ((results['results'].length < this.limit) || (results['results'] == 0)) {
            const custonLoader = document.querySelector(".custom-loader");
            if (custonLoader) {
              this.carregou();
            }
            this.limit = 0;
            this.fim = true;
            this.carregando = false;
            this.createFimLoader();
          }

        } else {
          console.log(results['message']);
        }
      }).catch(error => {
        // Lidar com erros
        console.error('Erro:', error);
      });
  }

  createPost(result) {

    const areaPost = document.getElementById("areaPost");

    const publication = document.createElement("section");
    publication.setAttribute("class", "publication");
    publication.setAttribute("data-postid", result.id);
    publication.setAttribute("data-postuserid", result.user_id);

    if (result.sh_user_id != null) {
      this.createPerfilShare(result, publication);
    } else if (result.lik_user_id != null) {
      this.createPerfilLike(result, publication);
    }

    const postMenuDrop = document.createElement("div");
    postMenuDrop.setAttribute("class", "postMenuDrop");

    const btnPostMenuDrop = document.createElement("button");
    btnPostMenuDrop.setAttribute("class", "btnPostMenuDrop");
    btnPostMenuDrop.innerHTML = "...";
    btnPostMenuDrop.onclick = () => {
      if (this.userId == result.user_id) {
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
      this.editarPost(linkEditar, result);
    }

    linkEditar.appendChild(imgEditar);
    linkEditar.innerHTML += "Editar";

    const imgDelete = document.createElement("img");
    imgDelete.setAttribute("class", "imgDelete");
    imgDelete.setAttribute("src", "./assets/icons/delete.svg");

    const linkExcluir = document.createElement("a");
    linkExcluir.onclick = () => {
      this.excluirPost(publication, result);
    }

    linkExcluir.appendChild(imgDelete);
    linkExcluir.innerHTML += "Excluir";

    linksPostMenuDrop.appendChild(linkEditar);
    linksPostMenuDrop.appendChild(linkExcluir);
    navLinks.appendChild(linksPostMenuDrop);
    postMenuDrop.appendChild(btnPostMenuDrop);
    postMenuDrop.appendChild(navLinks);
    publication.appendChild(postMenuDrop);

    const publicationPost = document.createElement("div");
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

    const cabecalho = document.createElement("div");
    cabecalho.setAttribute("class", "cabecalho");

    const postCabecalho = document.createElement("div");
    postCabecalho.setAttribute("class", "postCabecalho");

    const aNomeUserPost = document.createElement("a");
    aNomeUserPost.setAttribute("href", `/RenderChat/app/?r=perfil&id=${publication.dataset.postuserid}`);
    aNomeUserPost.innerHTML = `${result.first_name} ${result.last_name}`;

    const h5 = document.createElement("h5");
    h5.innerHTML = result.created_at;

    postCabecalho.appendChild(aNomeUserPost);
    cabecalho.appendChild(postCabecalho);
    cabecalho.appendChild(h5);
    perfil.appendChild(cabecalho);

    const divPost = document.createElement("div");
    const pPost = document.createElement("p");
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
      this.showLikes(result);
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
      this.showComments(comentarios, result);
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
      this.showShares(result);
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

    if (result.li_post_id == null) {
      imgLike.setAttribute("src", "./assets/icons/like.svg");
      publication.setAttribute("data-like", "no");
    } else {
      imgLike.setAttribute("src", "./assets/icons/deslike.svg");
      publication.setAttribute("data-like", "yes");
      buttonLike.style.color = "#090";
    }

    const spanCurtir = document.createElement("span");
    spanCurtir.innerHTML = "Curtir"

    buttonLike.appendChild(imgLike);
    buttonLike.appendChild(spanCurtir);

    buttonLike.onclick = () => {
      this.likeDeslike(buttonLike, result, imgLike, publication);
    }

    const btnComment = document.createElement("button");
    btnComment.setAttribute("type", "button");
    btnComment.setAttribute("class", "btnComment");

    const imgComment = document.createElement("img");
    imgComment.setAttribute("class", "imgComment");
    imgComment.setAttribute("src", "./assets/icons/comment.svg");

    btnComment.appendChild(imgComment);
    btnComment.innerHTML += "Comentar";

    btnComment.onclick = () => {
      this.showComments(btnComment, result);
    }

    const btnShare = document.createElement("button");
    btnShare.setAttribute("type", "button");

    const imgShare = document.createElement("img");
    imgShare.setAttribute("class", "imgShare");
    imgShare.setAttribute("src", "./assets/icons/share.svg");

    btnShare.appendChild(imgShare);
    btnShare.innerHTML += "Compartilhar";

    btnShare.onclick = () => {
      this.sharePost(btnShare, result);
    }

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
      txtTextAreaComment.style.height = `${scHeight - 20}px`;
    });

    const imgEnviarComment = document.createElement("img");
    imgEnviarComment.setAttribute("class", "imgEnviarComment");
    imgEnviarComment.setAttribute("src", "./assets/icons/send.svg");

    const btnEnviarComment = document.createElement("button");
    btnEnviarComment.setAttribute("class", "btnEnviarComment");
    btnEnviarComment.setAttribute("type", "button");
    btnEnviarComment.onclick = () => {
      this.commentPost(btnEnviarComment, result);
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

  createPerfilLike(result, publication) {
    const perfil_like = document.createElement("header");
    perfil_like.setAttribute("class", "perfil_like");
    perfil_like.onclick = () => {
      this.showLikes(result);
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

  createPerfilShare(result, publication) {

    const perfil_share = document.createElement("header");
    perfil_share.setAttribute("class", "perfil_share");
    perfil_share.onclick = () => {
      this.showShares(result);
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

  mostrarCommentMenuDrop(commentId, commentUser, user) {

    const janela = document.getElementById(commentId);

    if (user == commentUser) {
      if (janela.classList.contains("navLinksCommentInvisible")) {
        janela.classList.remove("navLinksCommentInvisible");
        janela.classList.add("navLinksCommentVisible");
      } else {
        janela.classList.remove("navLinksCommentVisible");
        janela.classList.add("navLinksCommentInvisible");
      }
    }
  }

  createComment(result, area) {
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
    btnCommentMenuDrop.onclick = () => {
      this.mostrarCommentMenuDrop(commentId, commentUserId, this.userId);
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

  editarPost(element, result) {
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
      const endPoint = `Controllers/update_post?post=${post}&foto_url=${fotoUrl}&video_url=${videoUrl}&post_id=${postId}&post_user_id=${postUserId}&user_id=${this.userId}`;
      fetch(endPoint)
        .then(res => res.json())
        .then(results => {
          document.querySelector("#postModal textarea").value = "";
          if (results.status == "SUCESS") {
            janela.classList.add("esconderPostModal");
            areaPost.remove();
            this.resetDados();
            this.getAllPosts();
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

  excluirPost(publication, result) {
    const endPoint = `Controllers/delete_post.php?id=${result.id}`;
    fetch(endPoint)
      .then(res => res.json())
      .then(results => {
        if (results.status == "SUCESS") {
          publication.remove();
          this.postPosition -= 1;
        } else {
          console.log(results['message']);
        }
      }).catch(error => {
        console.error('Erro:', error);
      });
  }

  showLikes(result) {
    const janela = document.getElementById("arealinksCurtidas");
    const btnFechar = document.getElementById("btnFecharCurtidas");

    const totalLikes = document.querySelector(".totalCurtidas span");
    const campo = document.querySelector(".campoCurtidas");

    campo.innerHTML = "";

    const endPoint = `Controllers/get_all_likes/index.php?post_id=${result.id}&user_id=${this.userId}`;

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

            const hr = document.createElement("hr");

            perfilCurtidas.appendChild(img);
            perfilCurtidas.appendChild(h5);

            if (like.friendrequest == 1 && like.user_id != this.userId) {
              const confirm = document.createElement("div");
              confirm.setAttribute("class", "confirm");
              confirm.innerText = "Aguardando confirmação";
              perfilCurtidas.appendChild(confirm);;
            }

            if (like.friend != 1 && like.friendrequest != 1 && like.user_id != this.userId) {
              const btnAdicionar = document.createElement("button");
              btnAdicionar.type = "button";
              btnAdicionar.innerText = "Adicionar";
              btnAdicionar.addEventListener("click", (evt) => {
                const endPoint = `Controllers/create_new_friendrequests?user_id=${this.userId}&friends_id=${like.user_id}`;
                fetch(endPoint)
                  .then(res => res.json())
                  .then(results => {
                    if (results.status == "SUCESS") {
                      evt.target.remove();
                      const confirm = document.createElement("div");
                      confirm.setAttribute("class", "confirm");
                      confirm.innerText = "Aguardando confirmação";
                      perfilCurtidas.appendChild(confirm);
                    } else {
                      console.log(results['message']);
                    }
                  }).catch(error => {
                    // Lidar com erros
                    console.error('Erro:', error);
                  });
              });
              perfilCurtidas.appendChild(btnAdicionar);
            }

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

  showComments(element, result) {
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
            this.createComment(result, area);
          });

        } else {
          console.log(results['message']);
        }
      }).catch(error => {
        // Lidar com erros
        console.error('Erro:', error);
      });
  }

  showShares(result) {
    const janela = document.getElementById("arealinksComp");
    const btnFechar = document.getElementById("btnFecharComp");

    const totalShares = document.querySelector(".totalComp span");
    const campo = document.querySelector(".campoComp");
    const imagem = document.querySelector(".campoComp .perfilComp img");

    campo.innerHTML = "";

    const endPoint = `Controllers/get_all_shares/index.php?post_id=${result.id}&user_id=${this.userId}`;
    fetch(endPoint)
      .then(res => res.json())
      .then(results => {
        if (results.status == "SUCESS") {

          totalShares.innerText = results['results'].length;

          results['results'].forEach((share) => {

            const perfilComp = document.createElement("div");
            perfilComp.setAttribute("class", "perfilComp");
            perfilComp.setAttribute("data-idperf", share.user_id);

            const img = document.createElement("img");

            if (share['photo_url'] != null) {
              img.src = `assets/images/${share['photo_url']}`;
            } else {
              img.src = "assets/images/sem-foto.jpg";
            }

            const h5 = document.createElement("h5");
            h5.innerText = `${share['first_name']} ${share['last_name']}`;

            const hr = document.createElement("hr");

            perfilComp.appendChild(img);
            perfilComp.appendChild(h5);

            if (share.friendrequest == 1 && share.user_id != this.userId) {
              const confirm = document.createElement("div");
              confirm.setAttribute("class", "confirm");
              confirm.innerText = "Aguardando confirmação";
              perfilComp.appendChild(confirm);;
            }

            if (share.friend != 1 && share.friendrequest != 1 && share.user_id != this.userId) {
              const btnAdicionar = document.createElement("button");
              btnAdicionar.type = "button";
              btnAdicionar.innerText = "Adicionar";
              btnAdicionar.addEventListener("click", (evt) => {

                const endPoint = `Controllers/create_new_friendrequests?user_id=${this.userId}&friends_id=${share.user_id}`;
                fetch(endPoint)
                  .then(res => res.json())
                  .then(results => {
                    if (results.status == "SUCESS") {
                      const users = [...document.querySelectorAll(".perfilComp")];
                      users.forEach((item) => {
                        if (item.dataset.idperf == share.user_id) {
                          item.lastChild.remove();
                          const confirm = document.createElement("div");
                          confirm.setAttribute("class", "confirm");
                          confirm.innerText = "Aguardando confirmação";
                          item.appendChild(confirm);
                        }
                      });
                    } else {
                      console.log(results['message']);
                    }
                  }).catch(error => {
                    // Lidar com erros
                    console.error('Erro:', error);
                  });
              });
              perfilComp.appendChild(btnAdicionar);
            }

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

  likeDeslike(element, result, imgLike, publication) {
    const perfil_share_like = element.parentElement.parentElement.firstElementChild;
    let elementLikes;

    if (perfil_share_like.classList.contains("perfil_share") || perfil_share_like.classList.contains("perfil_like")) {
      elementLikes = element.parentNode.parentNode.children[3].firstElementChild.firstElementChild;
    } else {
      elementLikes = element.parentNode.parentNode.children[2].firstElementChild.firstElementChild;
    }

    const endPoint = `Controllers/create_new_like.php?user_id=${this.userId}&post_id=${result.id}`;

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

  sharePost(element, result) {
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

  commentPost(element, result) {
    let menssage;
    let spanComment;

    const perfil_like_share = element.parentElement.parentElement.parentElement.firstElementChild;

    if (perfil_like_share.classList.contains("perfil_share") || perfil_like_share.classList.contains("perfil_like")) {
      spanComment = element.parentNode.parentNode.parentNode.children[3].children[1].firstElementChild;
    } else {
      spanComment = element.parentNode.parentNode.parentNode.children[2].children[1].firstElementChild;
    }

    let area = element.parentNode.parentNode.lastElementChild;
    menssage = element.parentNode.firstElementChild.value.replaceAll('\n', '<br/>');
    element.parentNode.firstElementChild.value = "";
    element.parentNode.firstElementChild.style.height = "15px";

    const endPoint = `Controllers/create_new_comment?comment=${menssage}&user_id=${this.userId}&post_id=${result.id}`;

    if (menssage != "") {
      spanComment.innerHTML++;

      fetch(endPoint)
        .then(res => res.json())
        .then(results => {
          if (results.status == "SUCESS") {
            area.innerHTML = "";
            results['results'].forEach((result) => {
              this.createComment(result, area);
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

  postModal() {

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
            this.resetDados();
            this.getAllPosts();
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


}

export { FuncoesPosts };