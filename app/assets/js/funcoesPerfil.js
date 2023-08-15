
class FuncoesPerfil {

    urlAtual = window.location.href;
    urlClass = new URL(this.urlAtual);
    perfilId = this.urlClass.searchParams.get("id");

    constructor(perfilUserId) {
        this.perfilUserId = perfilUserId;
        this.userId = document.getElementById("principal").dataset.userid;
        this.getPerfil();
    }

    getPerfil = () => {
        if (!this.perfilId) {
            this.perfilId = this.perfilUserId;
        }

        const endPoint = `Controllers/get_perfil?id=${this.perfilId}&user_id=${this.userId}`

        fetch(endPoint)
            .then(res => res.json())
            .then(result => {
                if (result.status == "SUCESS") {
                    this.carregarPerfil(result);
                } else {
                    console.error('Erro:', result.status);
                }

            }).catch(error => {
                // Lidar com erros
                window.location.href = "?r=pagenotfound";
                console.error('Erro:', error);
            });
    }

    carregarPerfil = (result) => {
        const cabecalhoP = document.querySelector(".container-cabecalho-p .cabecalho-p");
        const capa = document.createElement("section");
        capa.setAttribute("class", "capa");

        const imagemCapa = document.createElement("section");
        imagemCapa.setAttribute("class", "imagem-capa");

        const imgCapaPerfil = document.createElement("img");

        if (result.results[0].capa_url != null) {
            imgCapaPerfil.setAttribute("src", `assets/images/${result.results[0].capa_url}`);
        } else {
            imgCapaPerfil.setAttribute("src", `assets/images/capa.jpg`);
        }

        imagemCapa.appendChild(imgCapaPerfil);

        capa.appendChild(imagemCapa);

        const perfil = document.createElement("section");
        perfil.setAttribute("class", "perfil-p");

        const imagemPerfil = document.createElement("section");
        imagemPerfil.setAttribute("class", "imagem-perfil");

        const imgPefil = document.createElement("img");

        if (result.results[0].photo_url != null) {
            imgPefil.setAttribute("src", `assets/images/${result.results[0].photo_url}`);
        } else {
            imgPefil.setAttribute("src", "assets/images/sem-foto.jpg");
        }

        imagemPerfil.appendChild(imgPefil);

        const descricao = document.createElement("div");
        descricao.setAttribute("class", "descricao");

        const nomeComp = document.createElement("h1");
        nomeComp.innerHTML = `${result.results[0].first_name} ${result.results[0].last_name}`;

        const amigos = document.createElement("h2");
        if (result.results[0].qtdFriend == 1) {
            amigos.innerHTML = `${result.results[0].qtdFriend} Amigo`;
        } else {
            amigos.innerHTML = `${result.results[0].qtdFriend} Amigos`;
        }

        const divBtns = document.createElement("div");
        divBtns.setAttribute("class", "divBtns");

        const btnMostrarAmigos = document.createElement("button");
        btnMostrarAmigos.setAttribute("class", "btnMostrarAmigos");
        btnMostrarAmigos.innerHTML = "Ver amigos";

        divBtns.appendChild(btnMostrarAmigos);

        if (result.results[0].friend == 0 && this.perfilId != this.userId) {
            if (result.results[0].friendrequestEnv == 1) {
                this.btnRemoveSolictEnvFriend(divBtns);
            } else if (result.results[0].friendrequestReceb == 1) {
                this.btnsSolicitRecebFriend(divBtns);
            } else {
                this.btnAddAmigos(divBtns);
            }
        } else if (this.perfilId != this.userId) {
            this.btnFriends(divBtns);
        }

        descricao.appendChild(nomeComp);
        descricao.appendChild(amigos);
        perfil.appendChild(imagemPerfil);
        perfil.appendChild(descricao);

        cabecalhoP.appendChild(capa);
        cabecalhoP.appendChild(divBtns);
        cabecalhoP.appendChild(perfil);
    }

    btnAddAmigos = (divBtns) => {
        const btnAddAmigos = document.createElement("button");
        btnAddAmigos.setAttribute("class", "btnAddAmigos");
        btnAddAmigos.innerHTML = "Adicionar aos amigos";
        btnAddAmigos.addEventListener("click", () => {
            const endPoint = `Controllers/create_new_friendrequests?user_id=${this.userId}&friends_id=${this.perfilId}`;
            fetch(endPoint)
                .then(res => res.json())
                .then(results => {
                    if (results.status == "SUCESS") {
                        btnAddAmigos.remove();
                        this.btnRemoveSolictEnvFriend(divBtns);
                    } else {
                        console.log(results['message']);
                    }
                }).catch(error => {
                    // Lidar com erros
                    console.error('Erro:', error);
                });
        });
        divBtns.appendChild(btnAddAmigos);
    }

    btnRemoveSolictEnvFriend = (divBtns) => {

        const btnRemoveSolicitFriend = document.createElement("button");
        btnRemoveSolicitFriend.setAttribute("class", "btnRemoveSolicitFriend");
        btnRemoveSolicitFriend.innerHTML = "Cancelar solicitação";
        btnRemoveSolicitFriend.addEventListener("click", () => {
            const endPoint = `Controllers/delete_friendrequest?user_id=${this.perfilId}&friends_id=${this.userId}`;
            fetch(endPoint)
                .then(res => res.json())
                .then(results => {
                    if (results.status == "SUCESS") {
                        btnRemoveSolicitFriend.remove();
                        this.btnAddAmigos(divBtns);
                    } else {
                        console.log(results['message']);
                    }
                }).catch(error => {
                    // Lidar com erros
                    console.error('Erro:', error);
                });
        });
        divBtns.appendChild(btnRemoveSolicitFriend);
    }

    btnFriends = (divBtns) => {

        const navLinkBtnAguardandoConfir = document.createElement("nav");
        navLinkBtnAguardandoConfir.setAttribute("class", "navLinkBtnAguardandoConfir");
        navLinkBtnAguardandoConfir.setAttribute("id", "navLinkBtnAguardandoConfir");

        const btnDesfazerAmizade = document.createElement("button");
        btnDesfazerAmizade.setAttribute("class", "btnRemoveSolicit");
        btnDesfazerAmizade.innerHTML = "Desfazer amizade";
        btnDesfazerAmizade.addEventListener("click", () => {
            const endPoint = `Controllers/delete_friend?user_id=${this.userId}&friends_id=${this.perfilId}`;
            fetch(endPoint)
                .then(res => res.json())
                .then(results => {
                    if (results.status == "SUCESS") {
                        divButtons.remove();
                        this.btnAddAmigos(divBtns);
                    } else {
                        console.log(results['message']);
                    }
                }).catch(error => {
                    // Lidar com erros
                    console.error('Erro:', error);
                });
        });

        navLinkBtnAguardandoConfir.appendChild(btnDesfazerAmizade);

        const divButtons = document.createElement("div");
        divButtons.setAttribute("class", "divButtonsUm");

        const btnFriend = document.createElement("button");
        btnFriend.setAttribute("class", "btnAmigos");
        btnFriend.innerHTML = "Amigo";
        btnFriend.addEventListener("click", () => {
            navLinkBtnAguardandoConfir.classList.toggle("mostrarBtnConfirm");
        });

        divButtons.appendChild(btnFriend);
        divButtons.appendChild(navLinkBtnAguardandoConfir);
        divBtns.appendChild(divButtons);
    }

    btnsSolicitRecebFriend = (divBtns) => {

        const navLinkBtnAguardandoConfir = document.createElement("nav");
        navLinkBtnAguardandoConfir.setAttribute("class", "navLinkBtnAguardandoConfir");
        navLinkBtnAguardandoConfir.setAttribute("id", "navLinkBtnAguardandoConfir");

        const btnConfirmSolicit = document.createElement("button");
        btnConfirmSolicit.setAttribute("class", "btnConfirmSolicit");
        btnConfirmSolicit.innerHTML = "Aceitar solicitação";
        btnConfirmSolicit.addEventListener("click", () => {
            this.endPoint = `Controllers/create_new_friend?user_id=${this.userId}&friends_id=${this.perfilId}`;
            fetch(this.endPoint)
                .then(res => res.json())
                .then(results => {

                    if (results.status == "SUCESS") {
                        divButtons.remove();
                        this.btnFriends(divBtns);
                    } else {
                        console.log(results['message']);
                    }
                }).catch(error => {
                    // Lidar com erros
                    console.error('Erro:', error);
                });

        });

        const btnRemoveSolicit = document.createElement("button");
        btnRemoveSolicit.setAttribute("class", "btnRemoveSolicit");
        btnRemoveSolicit.innerHTML = "Recusar solicitação";
        btnRemoveSolicit.addEventListener("click", () => {
            this.endPoint = `Controllers/delete_friendrequest?user_id=${this.userId}&friends_id=${this.perfilId}`;
            fetch(this.endPoint)
                .then(res => res.json())
                .then(results => {
    
                    if (results.status == "SUCESS") {
                        divButtons.remove();
                        this.btnAddAmigos(divBtns);
                    } else {
                        console.log(results['message']);
                    }
                }).catch(error => {
                    // Lidar com erros
                    console.error('Erro:', error);
                });
        });

        navLinkBtnAguardandoConfir.appendChild(btnConfirmSolicit);
        navLinkBtnAguardandoConfir.appendChild(btnRemoveSolicit);

        const divButtons = document.createElement("div");
        divButtons.setAttribute("class", "divButtonsDois");

        const btnAguardandoConfir = document.createElement("button");
        btnAguardandoConfir.setAttribute("class", "btnAguardandoConfir");
        btnAguardandoConfir.innerHTML = "Aguardando confirmação";
        btnAguardandoConfir.addEventListener("click", () => {
            navLinkBtnAguardandoConfir.classList.toggle("mostrarBtnConfirm");
        });
        divButtons.appendChild(btnAguardandoConfir);
        divButtons.appendChild(navLinkBtnAguardandoConfir);
        divBtns.appendChild(divButtons);
    }

}

export { FuncoesPerfil };
