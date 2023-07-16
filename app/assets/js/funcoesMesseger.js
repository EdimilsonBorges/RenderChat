class FuncoesMesseger {

    constructor(userId, nameC, photo) {
        this.userId = userId;
        this.nameC = nameC;
        this.photo = photo;
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
                    this.carregarConversa(itemChat.dataset.friendid);
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

                    const conversas = document.getElementById("conversas");

                    results['results'].forEach((result) => {
                        this.createMessegerChat(result, fromId);
                        conversas.scrollTop = conversas.scrollHeight;
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
        p.innerHTML = result.messeger;

        const visto = document.createElement("div");
        visto.style = "width: 10px; height: 10px; background-color: rgb(0, 255, 0); border-radius: 50%; margin-top: 16px; margin-left: -18px;";

        mensagemEu.appendChild(p);
        caixaEu.appendChild(mensagemEu);
        caixaEu.appendChild(visto);
        conversas.appendChild(caixaEu);
    }

    createMessegerOutro(result) {
        const conversas = document.getElementById("conversas");

        const caixaOutro = document.createElement("div");
        caixaOutro.setAttribute("class", "caixa-outro");

        const mensagemOutro = document.createElement("div");
        mensagemOutro.setAttribute("class", "mensagem-outro");

        const p = document.createElement("p");
        p.innerHTML = result.messeger;

        mensagemOutro.appendChild(p);
        caixaOutro.appendChild(mensagemOutro);
        conversas.appendChild(caixaOutro);
    }

    createItemChat(result) {

        const perfilFriends = document.getElementById("perfilFriends");

        const itemChat = document.createElement("div");
        itemChat.setAttribute("class", "itemChat");
        itemChat.setAttribute("data-friendid", result.id);

        itemChat.addEventListener("click", () => {
            this.carregarConversa(itemChat.dataset.friendid);
            const item = [...document.getElementsByClassName("itemChat")];
            item.forEach((ite)=>{
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
        online.setAttribute("class", "online");

        div.appendChild(img);
        div.appendChild(online);
        itemChat.appendChild(div);

        const mensagem = document.createElement("div");
        mensagem.setAttribute("class", "mensagem");

        const h3 = document.createElement("h3");
        h3.innerHTML = `${result.first_name} ${result.last_name}`;

        mensagem.appendChild(h3);

        itemChat.appendChild(mensagem);
        perfilFriends.appendChild(itemChat);
    }

}
export { FuncoesMesseger };