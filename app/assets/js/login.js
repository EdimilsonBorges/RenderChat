const btnFecharCreateAcount = document.getElementById("btnFecharCreateAcount");
const areaCreateAcount = document.getElementById("areaCreateAcount");

const btnCadastrar = document.getElementById("btnCadastrar");
btnCadastrar.addEventListener("click", ()=>{
    areaCreateAcount.classList.add("mostrarJanela");
});

btnFecharCreateAcount.addEventListener("click", ()=>{
    areaCreateAcount.classList.remove("mostrarJanela");
});

const radio = document.querySelectorAll(".radio");
const camposGenero = document.getElementById("camposGenero");
const outro = document.getElementById("outro");

for(let i = 0; i < radio.length; i++) {
    radio[i].onclick = ()=>{
        if(outro.checked){
            camposGenero.style.display = 'block';
        }else{
            camposGenero.style.display = 'none';
        }
    } 
}