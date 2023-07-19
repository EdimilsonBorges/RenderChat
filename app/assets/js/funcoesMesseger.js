class FuncoesMesseger {

    constructor(userId, nameC, photo, connection) {
        this.userId = userId;
        this.nameC = nameC;
        this.photo = photo;
        this.onlines = [];
        this.chat = connection;
        this.carregarInputs();
        this.receberMenssage();
        this.carregarUserChat();
    }

    carregarUserChat() {

        const endPoint = `Controllers/get_all_users?user_id=${this.userId}`;
        fetch(endPoint)
            .then(res => res.json())
            .then(results => {
                if (results.status == "SUCESS") {
                    results['results'].forEach((result) => {
                        this.createItemChat(result);
                    });
                    const itemChat = document.getElementsByClassName("itemChat")[0];
                    this.fromId = itemChat.dataset.friendid;
                    this.carregarConversa(this.fromId);
                    const item = [...document.getElementsByClassName("itemChat")];
                    item.forEach((ite) => {
                        ite.classList.remove("selected");
                    });
                    itemChat.classList.add("selected");
                } else {
                    console.log(results['message']);
                }

            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    carregarConversa(fromId) {

        const endPoint = `Controllers/get_messager_chat?user_id=${this.userId}&to_user_id=${fromId}`;

        fetch(endPoint)
            .then(res => res.json())
            .then(results => {
                if (results.status == "SUCESS") {
                    const perfilFriends = document.getElementById("conversas");
                    perfilFriends.innerHTML = "";

                    results['results'].forEach((result) => {
                        this.createMessegerChat(result, fromId);
                    });
                } else {
                    console.log(results['message']);
                }

            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    createMessegerChat(result, fromId) {

        if (this.userId === fromId && result['user_id'] === result['to_user_id']) {
            // Eu enviei para mim mesmo
            this.createMessegerEu(result);
        }

        if (this.userId != fromId && this.userId == result['user_id'] && result['user_id'] != result['to_user_id'] && fromId == result['to_user_id']) {
            // Eu enviei para outra pessoa
            this.createMessegerEu(result);
        }

        if (this.userId != fromId && result['user_id'] != result['to_user_id'] && fromId == result['user_id']) {
            // Eu recebi de outra pessoa
            this.createMessegerOutro(result);
        }
    }

    createMessegerEu(result) {

        const conversas = document.getElementById("conversas");

        const caixaEu = document.createElement("div");
        caixaEu.setAttribute("class", "caixa-eu");

        const mensagemEu = document.createElement("div");
        mensagemEu.setAttribute("class", "mensagem-eu");

        const p = document.createElement("p");
        p.innerHTML = result.message;

        const visto = document.createElement("div");
        visto.style = "width: 10px; height: 10px; background-color: rgb(0, 255, 0); border-radius: 50%; margin-top: 16px; margin-left: -18px;";

        mensagemEu.appendChild(p);
        caixaEu.appendChild(mensagemEu);
        caixaEu.appendChild(visto);
        conversas.appendChild(caixaEu);

        conversas.scrollTop = conversas.scrollHeight;
    }

    createMessegerOutro(result) {

        const conversas = document.getElementById("conversas");
        const caixaOutro = document.createElement("div");
        caixaOutro.setAttribute("class", "caixa-outro");

        const mensagemOutro = document.createElement("div");
        mensagemOutro.setAttribute("class", "mensagem-outro");

        const p = document.createElement("p");
        p.innerHTML = result.message;

        mensagemOutro.appendChild(p);
        caixaOutro.appendChild(mensagemOutro);
        conversas.appendChild(caixaOutro);

        conversas.scrollTop = conversas.scrollHeight;
    }

    marcarChatComoLido(fromId) {

        const endPoint = `Controllers/update_messeger_chat?from_id=${fromId}&user_id=${this.userId}`;
        fetch(endPoint)
            .then(res => res.json())
            .then(results => {
                if (results.status == "SUCESS") {
                    // atualiza para visto em tempo real
                    let read = { // cria um objeto msg
                        'userId': this.userId,
                        'fromId': fromId,
                        'read_at': Date(),
                    }
                    read = JSON.stringify(read); //converte para json
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

    createItemChat(result) {

        const perfilFriends = document.getElementById("perfilFriends");

        const itemChat = document.createElement("div");
        itemChat.setAttribute("class", "itemChat");
        itemChat.setAttribute("data-friendid", result.id);

        itemChat.addEventListener("click", () => {

            if (itemChat.children[2]) {
                itemChat.removeChild(itemChat.children[2]);
                this.marcarChatComoLido(result.id);
            }

            this.fromId = itemChat.dataset.friendid;
            this.carregarConversa(this.fromId);
            const item = [...document.getElementsByClassName("itemChat")];
            item.forEach((ite) => {
                ite.classList.remove("selected");
            });

            itemChat.classList.add("selected");
        });

        const div = document.createElement("div");
        const img = document.createElement("img");
        if (result.photo_url) {
            img.src = `assets/images/${result.photo_url}`;
        } else {
            img.src = `assets/images/sem-foto.jpg`;
        }
        const online = document.createElement("div");

        if (this.onlines.includes(result.id)) {
            online.setAttribute("class", "online");
        } else {
            online.setAttribute("class", "offline");
        }

        if (this.userId == result.id) {
            online.setAttribute("class", "online");
        }

        div.appendChild(img);
        div.appendChild(online);
        itemChat.appendChild(div);

        const mensagem = document.createElement("div");
        mensagem.setAttribute("class", "mensagem");

        const h3 = document.createElement("h3");
        h3.innerHTML = `${result.first_name} ${result.last_name}`;

        mensagem.appendChild(h3);

        itemChat.appendChild(mensagem);
        if (result.count_nread > 0) {
            const divNunHistory = document.createElement("div");
            divNunHistory.setAttribute("class", "divNunHistory");
            divNunHistory.innerHTML = result.count_nread;
            itemChat.appendChild(divNunHistory);
        }
        perfilFriends.appendChild(itemChat);
    }

    carregarInputs() {
        const btnChat = document.getElementById("btnChat");
        btnChat.addEventListener("click", (event) => {
            this.enviarMenssage(event);
        });
        const inputChatMessage = document.getElementById("inputChatMessage");
        inputChatMessage.addEventListener("keydown", (event) => {
            this.enviarMenssage(event);
        });
    }

    receberMenssage() {
        this.chat.conn.onmessage = (e) => {
            let data = JSON.parse(e.data);

            if (data.message == null && data.read_at == null) {
                this.onlines = JSON.stringify(data);
                this.onlineUpdate();
            } else if (data.userId != this.userId) {
                const selected = document.getElementsByClassName("selected")[0];
                if (data.userId == selected.dataset.friendid) {
                    this.marcarChatComoLido(data.userId);
                    this.createMessegerOutro(data);
                } else {
                    const itemChat = [...document.getElementsByClassName("itemChat")];
                    itemChat.forEach((item) => {
                        if (item.dataset.friendid === data.userId){
                            if(item.children[2]){
                                item.children[2].innerHTML++;
                            }else{
                                const divNunHistory = document.createElement("div");
                                divNunHistory.setAttribute("class", "divNunHistory");
                                divNunHistory.innerHTML = 1;
                                item.appendChild(divNunHistory);
                            }
                            
                        };
                    });
                }

            } else {
                this.createMessegerEu(data);
            }
        }
    }

    onlineUpdate() {
        const itemChat = [...document.getElementsByClassName("itemChat")];

        itemChat.forEach((item) => {
            const friendId = item.dataset.friendid;
            const div = item.firstChild.lastChild;
            if (this.onlines.includes(friendId)) {
                div.classList.remove("offline");
                div.classList.add("online");
            } else {
                div.classList.remove("online");
                div.classList.add("offline");
            }
        });

    }

    enviarMenssage(event) {

        if ((event.keyCode == 13) || (event.keyCode == null)) {

            const inputChatMessage = document.getElementById("inputChatMessage");

            if (inputChatMessage.value != "") {

                let msg = { // cria um objeto msg
                    'userId': this.userId,
                    'fromId': this.fromId,
                    'name': this.nameC,
                    'photo': this.photo,
                    'message': inputChatMessage.value
                }

                const endPoint = `Controllers/create_new_messager_chat?messeger=${inputChatMessage.value}&user_id=${this.userId}&to_user_id=${this.fromId}`;

                inputChatMessage.value = "";

                fetch(endPoint)
                    .then(res => res.json())
                    .then(results => {
                        if (results.status == "SUCESS") {
                            if (this.onlines.length === 0) {
                                this.createMessegerEu(msg);
                            } else {
                                msg = JSON.stringify(msg); //converte para json
                                this.chat.conn.send(msg);
                            }

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

}
export { FuncoesMesseger };