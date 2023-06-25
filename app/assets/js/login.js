const btnFecharCreateAcount = document.getElementById("btnFecharCreateAcount");
const areaCreateAcount = document.getElementById("areaCreateAcount");

const btnCadastrar = document.getElementById("btnCadastrar");
btnCadastrar.addEventListener("click", () => {
    areaCreateAcount.classList.add("mostrarJanela");
});

btnFecharCreateAcount.addEventListener("click", () => {
    areaCreateAcount.classList.remove("mostrarJanela");
});

const radio = document.querySelectorAll(".radio");
const camposGenero = document.getElementById("camposGenero");
const outro = document.getElementById("outro");

for (let i = 0; i < radio.length; i++) {
    radio[i].onclick = () => {
        if (outro.checked) {
            camposGenero.style.display = 'block';
        } else {
            camposGenero.style.display = 'none';
        }
    }
}

//=== cadastrar
const btnSubmit = document.getElementById("btnSubmit");
btnSubmit.addEventListener("click", () => {
    let nome = document.getElementById("campoNome").value;
    let sobrenome = document.getElementById("campoSobrenome").value;
    let email = document.getElementById("campoEmail").value;
    let senha = document.getElementById("campoNovaSenha").value;
    let repetirSenha = document.getElementById("campoRepetirSenha").value;
    let diaSelect = document.getElementById("campoDia");
    let dia = diaSelect.options[diaSelect.selectedIndex].text;
    let mesSelect = document.getElementById("campoMes");
    let mes = mesSelect.options[mesSelect.selectedIndex].value;
    let anoSelect = document.getElementById("campoAno");
    let ano = anoSelect.options[anoSelect.selectedIndex].text;
    let genero = document.querySelector('input[name="genero"]:checked').value;
    let outroGenero = camposGenero.value;
    let date_nasc = `${dia}/${mes}/${ano}`;

    let endpoint = "";

    if (senha === repetirSenha) {
        if (genero != "O") {
            endpoint = `Controllers/create_new_user?first_name=${nome}&&last_name=${sobrenome}&&email=${email}&&pass=${senha}&&date_nasc=${date_nasc}&&genre=${genero}`;
        } else {
            endpoint = `Controllers/create_new_user?first_name=${nome}&&last_name=${sobrenome}&&email=${email}&&pass=${senha}&&date_nasc=${date_nasc}&&genre=${outroGenero}`;
        }

        fetch(endpoint)
            .then(res => res.json())
            .then(results => {

                if (results.status == "SUCESS") {
                    areaCreateAcount.classList.remove("mostrarJanela");

                    nome = document.getElementById("campoNome").value = "";
                    sobrenome = document.getElementById("campoSobrenome").value = "";
                    email = document.getElementById("campoEmail").value = "";
                    senha = document.getElementById("campoNovaSenha").value = "";
                    repetirSenha = document.getElementById("campoRepetirSenha").value = "";
                    outroGenero = camposGenero.value = "";
                }
                console.log(results.message);
            });
    } else {
        console.log("AS SENHAS NÃO CONFEREM");
    }

});