class Chat {
    constructor(userId, nameC, photo, connection) {
        this.userId = userId;
        this.nameC = nameC;
        this.photo = photo;
        this.onlines = [];
        this.connection = connection;
        this.connect();
        this.carregarUserChat();
    }

    // abre a conexao do chat
    connect = () => {

        this.connection.conn.onmessage = (e) => {
            let data = JSON.parse(e.data);
            if (data.message == null && data.read_at == null) {
                this.onlines = JSON.stringify(data);
                this.onlineUpdate();
            } else if (data.userId != this.userId) {
                this.showChatMessage(data, "other", this.userId);
            } else {
                this.showChatMessage(data, "me", this.userId);
            }
        };
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

    carregarUserChat() {

        const endPoint = `Controllers/get_all_users?user_id=${this.userId}`;

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
                        itemChat.setAttribute("data-friendid", result.id);
                        let count = 0;
                        itemChat.onclick = () => {

                            if (count == 0) {
                                divTotalHistory.innerHTML -= result['count_nread'];
                                if (itemChat.children[2]) {
                                    const node = itemChat.children[2];
                                    itemChat.removeChild(node);
                                    this.marcarChatComoLido(result['id']);
                                }

                                count++
                            }
                            if (this.onlines.includes(result['id'])) {
                                this.openChat(result['id'], nomeCompleto, result['photo_url'], true);
                            } else {
                                this.openChat(result['id'], nomeCompleto, result['photo_url'], false);
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

                        if (this.onlines.includes(result['id'])) {
                            statu.setAttribute("class", "online");
                        } else {
                            statu.setAttribute("class", "offline");
                        }

                        if (this.userId == result['id']) {
                            statu.setAttribute("class", "online");
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

                        mensagem.appendChild(nome);
                        mensagem.appendChild(historico);
                        mensagem.appendChild(hr);

                        div.appendChild(imgPerfil);
                        div.appendChild(statu);

                        itemChat.appendChild(div);
                        itemChat.appendChild(mensagem);
                        if (result['count_nread'] > 0) {
                            let divNunHistory = document.createElement('div');
                            divNunHistory.setAttribute("class", "divNunHistory");
                            divNunHistory.innerText = result['count_nread'];
                            itemChat.appendChild(divNunHistory);
                        }

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

    openChat(fromId, nomeCompleto, perfImg, online) {

        const myElement = document.getElementById(this.userId + fromId);

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
            conversaBatePapoPerfil.id = this.userId + fromId;

            const submitBatePapo = document.createElement("div");
            submitBatePapo.setAttribute("class", "submit-bate-papo");
            submitBatePapo.id = "submit-bate-papo";

            const input = document.createElement("input");
            input.setAttribute("class", "chatMessage");
            input.id = `chat${fromId}`;
            input.type = "text";
            input.onkeydown = (event) => {
                this.enviarMessageChat(event, this.userId, fromId);
            }

            const btnchat = document.createElement("button");
            btnchat.setAttribute("class", "btnChat");
            btnchat.type = "button";
            btnchat.id = `btnChat${this.userId}`;
            btnchat.innerText = "Enviar";
            btnchat.onclick = (event) => {
                this.enviarMessageChat(event, this.userId, fromId);
            }

            submitBatePapo.appendChild(input);
            submitBatePapo.appendChild(btnchat);

            batePapoPerfil.appendChild(conversaBatePapoPerfil);
            batePapoPerfil.appendChild(submitBatePapo);

            areaChat.appendChild(batePapoPerfil);

            const endPoint = `Controllers/get_messager_chat?user_id=${this.userId}&to_user_id=${fromId}`;

            fetch(endPoint)
                .then(res => res.json())
                .then(results => {
                    if (results.status == "SUCESS") {
                        results['results'].forEach((result) => {

                            if (this.userId == fromId && result['user_id'] == result['to_user_id']) {
                                // eu enviei para mim mesmo
                                let msg = { // cria um objeto msg
                                    'userId': this.userId,
                                    'fromId': fromId,
                                    'message': result['message'],
                                    'read_at': result['read_at']
                                }
                                this.showChatMessage(msg, "me");
                            }

                            if (this.userId != fromId && this.userId == result['user_id'] && result['user_id'] != result['to_user_id'] && fromId == result['to_user_id']) {
                                // eu enviei para outra pessoa
                                let msg = { // cria um objeto msg
                                    'userId': this.userId,
                                    'fromId': fromId,
                                    'message': result['message'],
                                    'read_at': result['read_at']
                                }
                                this.showChatMessage(msg, "me");
                            }
                            if (this.userId != fromId && result['user_id'] != result['to_user_id'] && fromId == result['user_id']) {
                                // eu recebi de outra pessoa
                                let msg = { // cria um objeto msg
                                    'userId': fromId,
                                    'fromId': this.userId,
                                    'message': result['message'],
                                    'read_at': result['read_at']
                                }
                                this.showChatMessage(msg, "other");
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

    showChatMessage(msg, user) {

        if (user == "me") {

            let areaMenssage = document.getElementById(msg.userId + msg.fromId);

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
            let areaMenssage = document.getElementById(msg.fromId + msg.userId);
            this.openChat(msg.userId, msg.name, msg.photo, true);

            if (areaMenssage != null) {
                this.receberMensagemChat(msg);
                areaMenssage.scrollTop = areaMenssage.scrollHeight;
            }

        }
    }

    enviarMessageChat(event, userId, fromId) {

        if ((event.keyCode == 13) || (event.keyCode == null)) {

            const chatMessage = document.getElementById(`chat${fromId}`);

            if (chatMessage.value != "") {

                let msg = { // cria um objeto msg
                    'userId': userId,
                    'fromId': fromId,
                    'name': this.nameC,
                    'photo': this.photo,
                    'message': chatMessage.value
                }

                const endPoint = `Controllers/create_new_messager_chat?messeger=${chatMessage.value}&user_id=${userId}&to_user_id=${fromId}`;

                chatMessage.value = "";

                fetch(endPoint)
                    .then(res => res.json())
                    .then(results => {
                        if (results.status == "SUCESS") {
                            if (this.onlines.length === 0) {
                                this.showChatMessage(msg, "me", this.userId);
                            } else {
                                msg = JSON.stringify(msg); //converte para json
                                this.connection.conn.send(msg);
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

    receberMensagemChat = (msg) => {

        let areaMenssage = document.getElementById(msg.fromId + msg.userId);

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
}
export { Chat };