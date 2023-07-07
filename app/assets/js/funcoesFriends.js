class FuncoesFriends {

    constructor(userid) {
        this.userid = userid;
        this.containerFriends = document.getElementById("containerFriends");
        this.btnSugestoes = document.getElementById("btnSugestoes");
        this.btnSugestoes.style.backgroundColor = "#700";
        this.getAllSugestionFriends();
        this.buttons();
    }


    buttons = () => {
        this.btnAllFriends = document.getElementById("btnAllFriends");
        this.btnAllFriends.addEventListener("click", () => {
            this.containerFriends.innerHTML = "";
            this.getAllFriends();
            this.btnAllFriends.style.backgroundColor = "#700";
            this.btnSolicitacoesE.style.backgroundColor = "#e22";
            this.btnSolicitacoesR.style.backgroundColor = "#e22";
            this.btnSugestoes.style.backgroundColor = "#e22";
        });
        this.btnSolicitacoesE = document.getElementById("btnSolicitacoesE");
        this.btnSolicitacoesE.addEventListener("click", () => {
            this.containerFriends.innerHTML = "";
            this.getSolicitacoesFriendsE();
            this.btnSolicitacoesE.style.backgroundColor = "#700";
            this.btnSolicitacoesR.style.backgroundColor = "#e22";
            this.btnAllFriends.style.backgroundColor = "#e22";
            this.btnSugestoes.style.backgroundColor = "#e22";
        });
        this.btnSolicitacoesR = document.getElementById("btnSolicitacoesR");
        this.btnSolicitacoesR.addEventListener("click", () => {
            this.containerFriends.innerHTML = "";
            this.getSolicitacoesFriendsR();
            this.btnSolicitacoesR.style.backgroundColor = "#700";
            this.btnSolicitacoesE.style.backgroundColor = "#e22";
            this.btnAllFriends.style.backgroundColor = "#e22";
            this.btnSugestoes.style.backgroundColor = "#e22";
        });
        this.btnSugestoes = document.getElementById("btnSugestoes");
        this.btnSugestoes.addEventListener("click", () => {
            this.containerFriends.innerHTML = "";
            this.getAllSugestionFriends();
            this.btnSugestoes.style.backgroundColor = "#700";
            this.btnSolicitacoesE.style.backgroundColor = "#e22";
            this.btnSolicitacoesR.style.backgroundColor = "#e22";
            this.btnAllFriends.style.backgroundColor = "#e22";
        });
    }

    getAllSugestionFriends = () => {
        this.endPoint = `Controllers/get_all_sugestion_friends?user_id=${this.userid}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.status == "SUCESS") {
                    results['results'].forEach(result => {

                        this.perfilFriends = document.createElement("div");
                        this.perfilFriends.setAttribute("class", "perfil-friends");

                        this.img = document.createElement("img");
                        if (result.photo_url) {
                            this.img.src = `assets/images/${result.photo_url}`;
                        } else {
                            this.img.src = `assets/images/sem-foto.jpg`;
                        }


                        this.h3 = document.createElement("h3");
                        this.h3.innerHTML = `${result.first_name} ${result.last_name}`

                        this.btnAdicionar = document.createElement("button");
                        this.btnAdicionar.setAttribute("class", "btnAdicionar");
                        this.btnAdicionar.innerHTML = "Adicionar aos amigos";

                        this.btnAdicionar.addEventListener("click", (event) => {
                            this.enviarConvite(event, result.friends_id);
                        });

                        this.perfilFriends.appendChild(this.img);
                        this.perfilFriends.appendChild(this.h3);
                        this.perfilFriends.appendChild(this.btnAdicionar);

                        this.containerFriends.appendChild(this.perfilFriends);
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
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    cancelConvite = (event, friends_id) =>{
        this.endPoint = `Controllers/delete_friendrequest?user_id=${friends_id}&friends_id=${this.userid}`;
        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.status == "SUCESS") {
                    event.target.parentNode.remove();
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

                if (results.status == "SUCESS") {
                    results['results'].forEach(result => {

                        this.perfilFriends = document.createElement("div");
                        this.perfilFriends.setAttribute("class", "perfil-friends");

                        this.img = document.createElement("img");
                        if (result.photo_url) {
                            this.img.src = `assets/images/${result.photo_url}`;
                        } else {
                            this.img.src = `assets/images/sem-foto.jpg`;
                        }


                        this.h3 = document.createElement("h3");
                        this.h3.innerHTML = `${result.first_name} ${result.last_name}`

                        this.buttonRemover = document.createElement("button");
                        this.buttonRemover.setAttribute("class", "btnRemover");
                        this.buttonRemover.innerHTML = "Remover dos amigos";

                        this.buttonRemover.addEventListener("click", (event) => {
                            this.removerFriend(event, result.friends_id);
                        });

                        this.perfilFriends.appendChild(this.img);
                        this.perfilFriends.appendChild(this.h3);
                        this.perfilFriends.appendChild(this.buttonRemover);

                        this.containerFriends.appendChild(this.perfilFriends);
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

                if (results.status == "SUCESS") {
                    results['results'].forEach(result => {

                        this.perfilFriends = document.createElement("div");
                        this.perfilFriends.setAttribute("class", "perfil-friends");

                        this.img = document.createElement("img");
                        if (result.photo_url) {
                            this.img.src = `assets/images/${result.photo_url}`;
                        } else {
                            this.img.src = `assets/images/sem-foto.jpg`;
                        }

                        this.h3 = document.createElement("h3");
                        this.h3.innerHTML = `${result.first_name} ${result.last_name}`

                        this.btnCancelSolicit = document.createElement("button");
                        this.btnCancelSolicit.setAttribute("class", "btnCancelSolicit");
                        this.btnCancelSolicit.innerHTML = "Cancelar";

                        this.btnCancelSolicit.addEventListener("click", (event) => {
                            this.cancelConvite(event, result.friends_id);
                        });

                        this.perfilFriends.appendChild(this.img);
                        this.perfilFriends.appendChild(this.h3);
                        this.perfilFriends.appendChild(this.btnCancelSolicit);

                        this.containerFriends.appendChild(this.perfilFriends);
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

                if (results.status == "SUCESS") {
                    results['results'].forEach(result => {

                        this.perfilFriends = document.createElement("div");
                        this.perfilFriends.setAttribute("class", "perfil-friends");

                        this.img = document.createElement("img");
                        if (result.photo_url) {
                            this.img.src = `assets/images/${result.photo_url}`;
                        } else {
                            this.img.src = `assets/images/sem-foto.jpg`;
                        }

                        this.h3 = document.createElement("h3");
                        this.h3.innerHTML = `${result.first_name} ${result.last_name}`

                        this.btnAceitarFriend = document.createElement("button");
                        this.btnAceitarFriend.setAttribute("class", "btnAceitarFriend");
                        this.btnAceitarFriend.innerHTML = "Aceitar";

                        this.btnAceitarFriend.addEventListener("click", (event) => {
                            this.aceitarConvite(event, result.friends_id);
                        });

                        this.btnRecusarFriend = document.createElement("button");
                        this.btnRecusarFriend.setAttribute("class", "btnRecusarFriend");
                        this.btnRecusarFriend.innerHTML = "Recusar";

                        this.btnRecusarFriend.addEventListener("click", (event) => {
                            this.negarConvite(event, result.friends_id);
                        });

                        this.perfilFriends.appendChild(this.img);
                        this.perfilFriends.appendChild(this.h3);
                        this.perfilFriends.appendChild(this.btnAceitarFriend);
                        this.perfilFriends.appendChild(this.btnRecusarFriend);

                        this.containerFriends.appendChild(this.perfilFriends);
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

export { FuncoesFriends };