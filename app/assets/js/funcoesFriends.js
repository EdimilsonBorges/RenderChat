class FuncoesFriends {

    constructor(userid) {
        this.userid = userid;
        this.createContainerFriends();
    }

    createContainerFriends = () => {

        this.endPoint = `Controllers/get_all_friends?user_id=${this.userid}`;

        fetch(this.endPoint)
            .then(res => res.json())
            .then(results => {

                if (results.status == "SUCESS") {
                    results['results'].forEach(result => {
                        this.containerFriends = document.getElementById("containerFriends");

                        this.perfilFriends = document.createElement("div");
                        this.perfilFriends.setAttribute("class", "perfil-friends");

                        this.img = document.createElement("img");
                        if (result.photo_url) {
                            this.img.src = `assets/images/${result.photo_url}`;
                        } else {
                            this.img.src = `assets/images/sem-foto.jpg`;
                        }


                        this.h3 = document.createElement("h3");
                        this.h3.innerHTML = `${result.first_name} ${result.last_name}`

                        this.buttonRemover = document.createElement("button");
                        this.buttonRemover.setAttribute("class", "btnRemover");
                        this.buttonRemover.innerHTML = "Remover";

                        this.perfilFriends.appendChild(this.img);
                        this.perfilFriends.appendChild(this.h3);
                        this.perfilFriends.appendChild(this.buttonRemover);

                        this.containerFriends.appendChild(this.perfilFriends);
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

export { FuncoesFriends };