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
            this.btnSolicitacoes.style.backgroundColor = "#e22";
            this.btnSugestoes.style.backgroundColor = "#e22";
        });
        this.btnSolicitacoes = document.getElementById("btnSolicitacoes");
        this.btnSolicitacoes.addEventListener("click", () => {
            this.containerFriends.innerHTML = "";
            this.getSolicitacoesFriends();
            this.btnSolicitacoes.style.backgroundColor = "#700";
            this.btnAllFriends.style.backgroundColor = "#e22";
            this.btnSugestoes.style.backgroundColor = "#e22";
        });
        this.btnSugestoes = document.getElementById("btnSugestoes");
        this.btnSugestoes.addEventListener("click", () => {
            this.containerFriends.innerHTML = "";
            this.getAllSugestionFriends();
            this.btnSugestoes.style.backgroundColor = "#700";
            this.btnSolicitacoes.style.backgroundColor = "#e22";
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
                            event.target.parentNode.remove();
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

    getSolicitacoesFriends = () => {
        this.endPoint = `Controllers/get_solicitacao_friends?user_id=${this.userid}`;
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
                            event.target.parentNode.remove();
                        });

                        this.btnRecusarFriend = document.createElement("button");
                        this.btnRecusarFriend.setAttribute("class", "btnRecusarFriend");
                        this.btnRecusarFriend.innerHTML = "Recusar";

                        this.btnRecusarFriend.addEventListener("click", (event) => {
                            event.target.parentNode.remove();
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