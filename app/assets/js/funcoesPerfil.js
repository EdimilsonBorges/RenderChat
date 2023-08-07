
class FuncoesPerfil {

    urlAtual = window.location.href;
    urlClass = new URL(this.urlAtual);
    perfilId = this.urlClass.searchParams.get("id");

    constructor(perfilUserId) {
        this.perfilUserId = perfilUserId;
        this.getPerfil();
    }

    getPerfil = () => {
        if (!this.perfilId) {
            this.perfilId = this.perfilUserId;
        }

        const endPoint = `Controllers/get_perfil?id=${this.perfilId}`

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
                window.location.href = "?r=pagenotfound" ;
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
        perfil.appendChild(imagemPerfil);

        const descricao = document.createElement("div");
        descricao.setAttribute("class", "descricao");

        const nomeComp = document.createElement("h1");
        nomeComp.innerHTML = `${result.results[0].first_name} ${result.results[0].last_name}`;

        const amigos = document.createElement("h2");
        amigos.innerHTML = "569 Amigos exemplo";

        descricao.appendChild(nomeComp);
        descricao.appendChild(amigos);
        perfil.appendChild(descricao);

        cabecalhoP.appendChild(capa);
        cabecalhoP.appendChild(perfil);
    }

}

export { FuncoesPerfil };
