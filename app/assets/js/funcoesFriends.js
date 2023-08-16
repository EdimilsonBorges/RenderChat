class FuncoesFriends {

    constructor(userid) {
        this.userid = userid;
        this.containerFriends = document.getElementById("containerFriends");
        this.btnSugestoes = document.getElementById("btnSugestoes");
        this.btnSugestoes.classList.add("btnRemoverActive");
        this.getAllSugestionFriends();
        this.buttons();
    }

    buttons = () => {
        this.btnAllFriends = document.getElementById("btnAllFriends");
        this.btnAllFriends.addEventListener("click", () => {
            this.containerFriends.innerHTML = "";
            this.getAllFriends();
            this.btnAllFriends.classList.add("btnRemoverActive");
            this.btnSolicitacoesE.classList.remove("btnRemoverActive");
            this.btnSolicitacoesR.classList.remove("btnRemoverActive");
            this.btnSugestoes.classList.remove("btnRemoverActive");
        });
        this.btnSolicitacoesE = document.getElementById("btnSolicitacoesE");
        this.btnSolicitacoesE.addEventListener("click", () => {
            this.containerFriends.innerHTML = "";
            this.getSolicitacoesFriendsE();
            this.btnSolicitacoesE.classList.add("btnRemoverActive");
            this.btnAllFriends.classList.remove("btnRemoverActive");
            this.btnSolicitacoesR.classList.remove("btnRemoverActive");
            this.btnSugestoes.classList.remove("btnRemoverActive");
        });
        this.btnSolicitacoesR = document.getElementById("btnSolicitacoesR");
        this.btnSolicitacoesR.addEventListener("click", () => {
            this.containerFriends.innerHTML = "";
            this.getSolicitacoesFriendsR();
            this.btnSolicitacoesR.classList.add("btnRemoverActive");
            this.btnSolicitacoesE.classList.remove("btnRemoverActive");
            this.btnAllFriends.classList.remove("btnRemoverActive");
            this.btnSugestoes.classList.remove("btnRemoverActive");
        });
        this.btnSugestoes = document.getElementById("btnSugestoes");
        this.btnSugestoes.addEventListener("click", () => {
            this.containerFriends.innerHTML = "";
            this.getAllSugestionFriends();
            this.btnSugestoes.classList.add("btnRemoverActive");
            this.btnSolicitacoesR.classList.remove("btnRemoverActive");
            this.btnSolicitacoesE.classList.remove("btnRemoverActive");
            this.btnAllFriends.classList.remove("btnRemoverActive");
        });
    }

    getAllSugestionFriends = () => {
        this.endPoint = `Controllers/get_all_sugestion_friends?user_id=${this.userid}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.results.length === 0) {
                    this.addImageEmpty();
                }

                if (results.status == "SUCESS") {
                    results['results'].forEach(result => {
                        const perfilFriends = document.createElement("div");
                        perfilFriends.setAttribute("class", "perfil-friends");

                        this.createBannerPerfil(result, perfilFriends);
                        this.createBtnAdicionar(result, perfilFriends);
                    });
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    getAllFriends = () => {
        this.endPoint = `Controllers/get_all_friends?user_id=${this.userid}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.results.length === 0) {
                    this.addImageEmpty();
                }

                if (results.status == "SUCESS") {
                    results['results'].forEach(result => {
                        const perfilFriends = document.createElement("div");
                        perfilFriends.setAttribute("class", "perfil-friends");

                        this.createBannerPerfil(result, perfilFriends);
                        this.createBtnRemove(result, perfilFriends);
                    });
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    getSolicitacoesFriendsE = () => {
        this.endPoint = `Controllers/get_solici_env_friends?user_id=${this.userid}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.results.length === 0) {
                    this.addImageEmpty();
                }

                if (results.status == "SUCESS") {
                    results['results'].forEach(result => {
                        const perfilFriends = document.createElement("div");
                        perfilFriends.setAttribute("class", "perfil-friends");

                        this.createBannerPerfil(result, perfilFriends);
                        this.createBtnCancelSolicit(result, perfilFriends);
                    });
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    getSolicitacoesFriendsR = () => {
        this.endPoint = `Controllers/get_solici_receb_friends?user_id=${this.userid}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.results.length === 0) {
                    this.addImageEmpty();
                }

                if (results.status == "SUCESS") {
                    results['results'].forEach(result => {
                        const perfilFriends = document.createElement("div");
                        perfilFriends.setAttribute("class", "perfil-friends");

                        this.createBannerPerfil(result, perfilFriends);
                        this.createBtnAceitarFriend(result, perfilFriends);
                        this.createBtnRecusarFriend(result, perfilFriends);
                    });
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }


    enviarConvite = (event, friends_id) => {
        this.endPoint = `Controllers/create_new_friendrequests?user_id=${this.userid}&friends_id=${friends_id}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.status == "SUCESS") {
                    event.target.parentNode.remove();
                    if (!document.querySelector(".perfil-friends")) {
                        this.addImageEmpty();
                    }
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    aceitarConvite = (event, friends_id) => {
        this.endPoint = `Controllers/create_new_friend?user_id=${this.userid}&friends_id=${friends_id}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.status == "SUCESS") {
                    event.target.parentNode.remove();
                    if (!document.querySelector(".perfil-friends")) {
                        this.addImageEmpty();
                    }
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    negarConvite = (event, friends_id) => {
        this.endPoint = `Controllers/delete_friendrequest?user_id=${this.userid}&friends_id=${friends_id}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.status == "SUCESS") {
                    event.target.parentNode.remove();
                    if (!document.querySelector(".perfil-friends")) {
                        this.addImageEmpty();
                    }
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    cancelConvite = (event, friends_id) => {
        this.endPoint = `Controllers/delete_friendrequest?user_id=${friends_id}&friends_id=${this.userid}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.status == "SUCESS") {
                    event.target.parentNode.remove();
                    if (!document.querySelector(".perfil-friends")) {
                        this.addImageEmpty();
                    }

                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    removerFriend = (event, friends_id) => {
        this.endPoint = `Controllers/delete_friend?user_id=${this.userid}&friends_id=${friends_id}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.status == "SUCESS") {
                    event.target.parentNode.remove();
                    if (!document.querySelector(".perfil-friends")) {
                        this.addImageEmpty();
                    }
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    createBannerPerfil(result, perfilFriends) {

        const img = document.createElement("img");
        if (result.photo_url) {
            img.src = `assets/images/${result.photo_url}`;
        } else {
            img.src = `assets/images/sem-foto.jpg`;
        }
        img.addEventListener("click", () => {
            window.location.href = `/RenderChat/app/?r=perfil&id=${result.friends_id}`;
        });

        const namePerfil = document.createElement("h3");
        namePerfil.innerHTML = `${result.first_name} ${result.last_name}`
        namePerfil.addEventListener("click", () => {
            window.location.href = `/RenderChat/app/?r=perfil&id=${result.friends_id}`;
        });

        const friendsCount = document.createElement("h2");
        friendsCount.setAttribute("class","friendsCount");
        friendsCount.innerHTML = `${result.qtdFriendsCount} Amigos`
        friendsCount.addEventListener("click", () => {
            // window.location.href = `/RenderChat/app/?r=perfil&id=${result.friends_id}`;
        });

        const friendsCountComum = document.createElement("h2");
        friendsCountComum.setAttribute("class","friendsCountComum");
        friendsCountComum.innerHTML = `${result.qtdFriendsComun} Amigos em comum`
        friendsCountComum.addEventListener("click", () => {
            // window.location.href = `/RenderChat/app/?r=perfil&id=${result.friends_id}`;
        });
        perfilFriends.appendChild(img);
        perfilFriends.appendChild(namePerfil);
        perfilFriends.appendChild(friendsCount);
        perfilFriends.appendChild(friendsCountComum);
        this.containerFriends.appendChild(perfilFriends);
    }

    createBtnAdicionar(result, perfilFriends) {
        const btnAdicionar = document.createElement("button");
        btnAdicionar.setAttribute("class", "btnAdicionar");
        btnAdicionar.innerHTML = "Adicionar aos amigos";

        btnAdicionar.addEventListener("click", (event) => {
            this.enviarConvite(event, result.friends_id);
        });

        perfilFriends.appendChild(btnAdicionar);
    }

    createBtnRemove(result, perfilFriends) {
        const buttonRemover = document.createElement("button");
        buttonRemover.setAttribute("class", "btnRemover");
        buttonRemover.innerHTML = "Remover dos amigos";

        buttonRemover.addEventListener("click", (event) => {
            this.removerFriend(event, result.friends_id);
        });

        perfilFriends.appendChild(buttonRemover);
    }
    createBtnCancelSolicit(result, perfilFriends) {
        const btnCancelSolicit = document.createElement("button");
        btnCancelSolicit.setAttribute("class", "btnCancelSolicit");
        btnCancelSolicit.innerHTML = "Cancelar";

        btnCancelSolicit.addEventListener("click", (event) => {
            this.cancelConvite(event, result.friends_id);
        });
        perfilFriends.appendChild(btnCancelSolicit);
    }

    createBtnAceitarFriend(result, perfilFriends) {
        const btnAceitarFriend = document.createElement("button");
        btnAceitarFriend.setAttribute("class", "btnAceitarFriend");
        btnAceitarFriend.innerHTML = "Aceitar";

        btnAceitarFriend.addEventListener("click", (event) => {
            this.aceitarConvite(event, result.friends_id);
        });
        perfilFriends.appendChild(btnAceitarFriend);
    }

    createBtnRecusarFriend(result, perfilFriends) {
        const btnRecusarFriend = document.createElement("button");
        btnRecusarFriend.setAttribute("class", "btnRecusarFriend");
        btnRecusarFriend.innerHTML = "Recusar";

        btnRecusarFriend.addEventListener("click", (event) => {
            this.negarConvite(event, result.friends_id);
        });

        perfilFriends.appendChild(btnRecusarFriend);
    }

    addImageEmpty = () => {
        const imgEmpty = document.createElement("img");
        imgEmpty.setAttribute("class", "imgEmpty");
        imgEmpty.src = `assets/images/empty.svg`;
        this.containerFriends.appendChild(imgEmpty);
    }
}

export { FuncoesFriends };