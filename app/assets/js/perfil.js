
const urlAtual = window.location.href;
const urlClass = new URL(urlAtual);
let perfilId = urlClass.searchParams.get("id");
const perfilUserId =  document.getElementById("principal").dataset.userid;

if(!perfilId){
    perfilId = perfilUserId;
}

const endPoint  = `Controllers/get_perfil?id=${perfilId}`

fetch(endPoint)
.then(res => res.json())
.then(result =>{
    carregarPerfil(result);
}).catch(error => {
    // Lidar com erros
    console.error('Erro:', error);
});

function carregarPerfil(result) {
    const cabecalhoP = document.querySelector(".container-cabecalho-p .cabecalho-p");
    const capa = document.createElement("section");
    capa.setAttribute("class", "capa");

    const imagemCapa = document.createElement("section");
    imagemCapa.setAttribute("class", "imagem-capa");

    const imgCapaPerfil = document.createElement("img");

   if(result.results[0].capa_url != null){
    imgCapaPerfil.setAttribute("src", `assets/images/${result.results[0].capa_url}`);
   }else{
    imgCapaPerfil.setAttribute("src", `assets/images/capa.jpg`);
   }

   let sobreposicao;
   if(perfilId == perfilUserId){
    sobreposicao = document.createElement("div");
    sobreposicao.setAttribute("class", "sobreposicao-capa");
    const textoSobreposicao = document.createElement("p");
    textoSobreposicao.innerHTML = "Mudar imagem da capa";
    sobreposicao.appendChild(textoSobreposicao);
}

    imagemCapa.appendChild(imgCapaPerfil);

    if(perfilId == perfilUserId){
        imagemCapa.appendChild(sobreposicao);
    }
    
    capa.appendChild(imagemCapa);

    const perfil = document.createElement("section");
    perfil.setAttribute("class", "perfil-p");

    const imagemPerfil = document.createElement("section");
    imagemPerfil.setAttribute("class", "imagem-perfil");

    const imgPefil = document.createElement("img");

    if(result.results[0].photo_url != null){
        imgPefil.setAttribute("src", `assets/images/${result.results[0].photo_url}`);
    }else{
        imgPefil.setAttribute("src", "assets/images/sem-foto.jpg");
    }

    let sobreposicaoPerfil;
    if(perfilId == perfilUserId){
    sobreposicaoPerfil = document.createElement("div");
    sobreposicaoPerfil.setAttribute("class", "sobreposicao-perfil");
    const pSobreposicao = document.createElement("p");
    pSobreposicao.innerHTML = "Mudar foto";
    sobreposicaoPerfil.appendChild(pSobreposicao);
}
    imagemPerfil.appendChild(imgPefil);
    if(perfilId == perfilUserId){
        imagemPerfil.appendChild(sobreposicaoPerfil);
    }
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