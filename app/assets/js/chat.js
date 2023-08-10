class Chat {
    constructor(userId, nameC, photo, connection) {
        this.userId = userId;
        this.nameC = nameC;
        this.photo = photo;
        this.onlines = [];
        this.connection = connection;
        this.fucoesChat();
        this.connect();
        this.carregarUserChat();
    }

    fucoesChat = () => {
        const imgMinimizarChat = document.querySelector(".imgMinimizarChat");
        imgMinimizarChat.addEventListener("click", () => {
            this.ocultarDesocultarBatePapo();
        });
    }

    ocultarDesocultarBatePapo = () => {
        const batepapo = document.getElementById("batePapo");
        const imgMinimizarChat = document.querySelector(".imgMinimizarChat");

        if (batepapo.style.height == "75vh") {
            batepapo.style.height = "57px";
            imgMinimizarChat.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'><path fill='#555' d='m286.462-358.463-32.615-32.614L480-617.23l226.153 225.537-32.615 32.615L480-552.616 286.462-358.463Z'/></svg>";
        } else if (batepapo.style.height < "60px") {
            batepapo.style.height = "75vh";
            imgMinimizarChat.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 -960 960 960' width='48'><path fill='#555' d='M480-358.463 253.847-584.615l32.615-32.615L480-423.076l193.538-193.539L706.153-584 480-358.463Z'/></svg>";
        }
    }

    // abre a conexao do chat
    connect = () => {

        this.connection.conn.onmessage = (e) => {
            let data = JSON.parse(e.data);
            if (!data.message) {
                if (data.read_at) {
                    const visto = [...document.querySelectorAll(".vFalse")];
                    visto.forEach((e) => {
                        if (e.dataset.userid == data.userId) {
                            e.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20'><path fill='#0a0' d='M294.565-214.868 56.999-452.434 113-509l181 181 56.566 56.566-56.001 56.566ZM464-228.434 225.869-467.13 283-523.131l181 181 383.435-382.87L904.566-669 464-228.434Zm0-184.131-56.001-56.566 257-257L721-669.565l-257 257Z'/></svg>";
                        }
                    });

                } else {
                    this.onlines = JSON.stringify(data);
                    this.onlineUpdate();
                }
            } else if (data.userId != this.userId) {
                this.showChatMessageOutro(data);
            } else {
                this.showChatMessageEu(data);
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

                    const divTotalHistory = document.querySelector('.divTotalHistory');
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
                            if (parseInt(divTotalHistory.innerHTML) <= 0) {
                                divTotalHistory.classList.add("ocultar");
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
                        if (result.messeger) {
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

                        if (total_nread > 0) {
                            divTotalHistory.innerHTML = total_nread;
                            divTotalHistory.classList.remove("ocultar");
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

    openChat(fromId, nomeCompleto, perfImg, online) {

        const myElement = document.getElementById(this.userId + fromId);

        if (myElement == null) {

            const areaChat = document.getElementById("area-chat");

            const batePapoPerfil = document.createElement('section');
            batePapoPerfil.setAttribute('class', 'bate-papo-perfil');
            batePapoPerfil.style = 'height: 75vh';

            const headerPapoPerfil = document.createElement('header');
            headerPapoPerfil.setAttribute('class', 'perfil-bate-papo-perfil');

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

            const nomePessoaChat = document.createElement('div');
            nomePessoaChat.setAttribute("class", "nomePessoaChat");

            const h3 = document.createElement('h3');
            h3.innerText = nomeCompleto;

            const hr = document.createElement('hr');

            const imgFecharChat = document.createElement('div');
            imgFecharChat.setAttribute("class", "imgFecharChat");
            imgFecharChat.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960' width='30'><path fill='#555' d='m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z'/></svg>";
            imgFecharChat.addEventListener("click", () => {
                areaChat.removeChild(batePapoPerfil);
            });

            nomePessoaChat.appendChild(h3);
            div.appendChild(img);
            div.appendChild(status);
            headerPapoPerfil.appendChild(div);
            headerPapoPerfil.appendChild(nomePessoaChat);
            headerPapoPerfil.appendChild(imgFecharChat);
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
            input.type = "text";
            input.onkeydown = (event) => {
                this.enviarMessageChat(event, this.userId, fromId);
            }

            const btnchat = document.createElement("button");
            btnchat.setAttribute("class", "btnChat");
            btnchat.type = "button";;
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
                                this.showChatMessageEu(msg);
                            }

                            if (this.userId != fromId && this.userId == result['user_id'] && result['user_id'] != result['to_user_id'] && fromId == result['to_user_id']) {
                                // eu enviei para outra pessoa
                                let msg = { // cria um objeto msg
                                    'userId': this.userId,
                                    'fromId': fromId,
                                    'message': result['message'],
                                    'read_at': result['read_at']
                                }
                                this.showChatMessageEu(msg);
                            }
                            if (this.userId != fromId && result['user_id'] != result['to_user_id'] && fromId == result['user_id']) {
                                // eu recebi de outra pessoa
                                let msg = { // cria um objeto msg
                                    'userId': fromId,
                                    'fromId': this.userId,
                                    'message': result['message'],
                                    'read_at': result['read_at']
                                }
                                this.showChatMessageOutro(msg);
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

    showChatMessageEu(msg) {
        let areaMenssage = document.getElementById(msg.userId + msg.fromId);

        const caixaEu = document.createElement('div');
        caixaEu.setAttribute('class', 'caixa-eu');

        const mensagemEu = document.createElement('div');
        mensagemEu.setAttribute('class', 'mensagem-eu');

        const mensagemEup = document.createElement('p');
        mensagemEup.textContent = msg.message;

        const visto = document.createElement('div');
        visto.setAttribute("data-userid", msg.fromId);

        if (this.userId === msg.fromId) {
            visto.setAttribute("class", "visto vTrue");
            visto.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20'><path fill='#0a0' d='M294.565-214.868 56.999-452.434 113-509l181 181 56.566 56.566-56.001 56.566ZM464-228.434 225.869-467.13 283-523.131l181 181 383.435-382.87L904.566-669 464-228.434Zm0-184.131-56.001-56.566 257-257L721-669.565l-257 257Z'/></svg>";
            if (!msg.read_at) {
                this.marcarChatComoLido(msg.fromId);
            }
        } else if (msg.read_at) {
            visto.setAttribute("class", "visto vTrue");
            visto.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20'><path fill='#0a0' d='M294.565-214.868 56.999-452.434 113-509l181 181 56.566 56.566-56.001 56.566ZM464-228.434 225.869-467.13 283-523.131l181 181 383.435-382.87L904.566-669 464-228.434Zm0-184.131-56.001-56.566 257-257L721-669.565l-257 257Z'/></svg>";
        } else {
            visto.setAttribute("class", "visto vFalse");
            visto.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20'><path fill='#333' d='M294.565-214.868 56.999-452.434 113-509l181 181 56.566 56.566-56.001 56.566ZM464-228.434 225.869-467.13 283-523.131l181 181 383.435-382.87L904.566-669 464-228.434Zm0-184.131-56.001-56.566 257-257L721-669.565l-257 257Z'/></svg>";
        }

        mensagemEu.appendChild(mensagemEup);
        caixaEu.appendChild(mensagemEu);
        caixaEu.appendChild(visto);

        areaMenssage.appendChild(caixaEu);
        areaMenssage.scrollTop = areaMenssage.scrollHeight;
    }

    showChatMessageOutro(msg) {
        let areaMenssage = document.getElementById(msg.fromId + msg.userId);
        this.openChat(msg.userId, msg.name, msg.photo, true);

        const itemChat = [...document.getElementsByClassName("itemChat")];
        itemChat.forEach((elemento) => {
            const divNunHistory = elemento.children[2];

            if (divNunHistory && elemento.dataset.friendid == msg.userId) {
                let divTotalHistory = document.querySelector(".divTotalHistory");
                if (parseInt(divTotalHistory.innerHTML) > parseInt(divNunHistory.innerHTML)) {
                    divTotalHistory.innerHTML -= divNunHistory.innerHTML;
                } else {
                    divTotalHistory.remove();
                }

                divNunHistory.remove();
            }
        });

        if (!msg.read_at) {
            this.marcarChatComoLido(msg.userId);
        }

        if (areaMenssage) {
            this.receberMensagemChat(msg);
            areaMenssage.scrollTop = areaMenssage.scrollHeight;

            if (!msg.read_at) {
                // enviar mensagen de lido
                let read = {
                    'userId': this.userId,
                    'fromId': msg.userId,
                    'read_at': Date()
                }
                read = JSON.stringify(read); //converte para json
                this.connection.conn.send(read);
            }
        }
    }

    enviarMessageChat(event, userId, fromId) {

        if ((event.keyCode == 13) || (event.keyCode == null)) {

            const chatMessage = [...document.getElementsByClassName("chatMessage")];
            chatMessage.forEach((el) => {

                if (el.value != "") {

                    let msg = { // cria um objeto msg
                        'userId': userId,
                        'fromId': fromId,
                        'name': this.nameC,
                        'photo': this.photo,
                        'message': el.value
                    }

                    const endPoint = `Controllers/create_new_messager_chat?messeger=${el.value}&user_id=${userId}&to_user_id=${fromId}`;

                    el.value = "";

                    fetch(endPoint)
                        .then(res => res.json())
                        .then(results => {
                            if (results.status == "SUCESS") {
                                if (this.onlines.length === 0) {
                                    this.showChatMessageEu(msg);
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

            });
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