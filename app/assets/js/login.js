const btnFecharCreateAcount = document.getElementById("btnFecharCreateAcount");
const areaCreateAcount = document.getElementById("areaCreateAcount");

const btnCadastrar = document.getElementById("btnCadastrar");
btnCadastrar.addEventListener("click", ()=>{
    areaCreateAcount.classList.add("mostrarJanela");
});

btnFecharCreateAcount.addEventListener("click", ()=>{
    areaCreateAcount.classList.remove("mostrarJanela");
});
