class Chat {
    constructor(userId, nameC, photo) {
        this.userId = userId;
        this.nameC = nameC;
        this.photo = photo;
    }
    //const conn = new WebSocket('ws:localhost:8080/wss');
    conn = new WebSocket('ws:192.168.0.110:8080/wss');
    onlines = [];

    // abre a conexao do chat
    connect = () => {
        this.conn.onopen = (e) => {
            console.log("Connection established!");

            let msg = { // cria um objeto msg
                'userId': this.userId
            }
            msg = JSON.stringify(msg); //converte para json
            this.conn.send(msg);

            this.carregarUserChat();
        };

        this.conn.onclose = (e) => {
            console.log("Connection fechada!");
        };

        this.conn.onmessage = (e) => {

            let data = JSON.parse(e.data);

            if (data.message == null) {
                if (data.read_at == null) {
                    this.onlines = JSON.stringify(data);
                    this.carregarUserChat();
                }
            } else if (data.userId != this.userId) {
                const dados = JSON.stringify(data);
                this.showChatMessage(dados, "other", this.userId);
            } else {
                const dados = JSON.stringify(data);
                this.showChatMessage(dados, "me", this.userId);
            }
        };
    }

    carregarUserChat() {

        const endPoint = `Controllers/get_all_status?user_id=${this.userId}`;

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
                        itemChat.onclick = () => {

                            divNunHistory.style = "visibility:hidden; width:37px; font-size: 10pt; color: #fff; height: 21px; padding-top: 5px; background-color:rgb(141 0 0 / 80%); position: relative; right: 10px; top: 20px; border-radius: 50%;text-align: center; font-weight: bold;";
                            if (count == 0) {
                                divTotalHistory.innerHTML -= divNunHistory.innerHTML;
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

    openChat(fromId, nomeCompleto, perfImg, online) {

        this.marcarChatComoLido(fromId);

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
            btnchat.onclick =  (event) => {
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
                                    'message': result['messeger'],
                                    'read_at': result['read_at']
                                }
                                msg = JSON.stringify(msg); //converte para json
                                this.showChatMessage(msg, "me");
                            }

                            if (this.userId != fromId && this.userId == result['user_id'] && result['user_id'] != result['to_user_id'] && fromId == result['to_user_id']) {
                                // eu enviei para outra pessoa
                                let msg = { // cria um objeto msg
                                    'userId': this.userId,
                                    'fromId': fromId,
                                    'message': result['messeger'],
                                    'read_at': result['read_at']
                                }
                                msg = JSON.stringify(msg); //converte para json
                                this.showChatMessage(msg, "me");
                            }
                            if (this.userId != fromId && result['user_id'] != result['to_user_id'] && fromId == result['user_id']) {
                                // eu recebi de outra pessoa
                                let msg = { // cria um objeto msg
                                    'userId': fromId,
                                    'fromId': this.userId,
                                    'message': result['messeger'],
                                    'read_at': result['read_at']
                                }
                                msg = JSON.stringify(msg); //converte para json
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
                    this.conn.send(read);
                } else {
                    console.log(results['message']);
                }
            }).catch(error => {
                // Lidar com erros
                console.error('Erro:', error);
            });
    }

     showChatMessage(msg, user) {

        msg = JSON.parse(msg);
    
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
                            msg = JSON.stringify(msg); //converte para json
                            this.conn.send(msg);
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