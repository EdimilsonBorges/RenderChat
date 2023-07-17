class ConnectChat {

    constructor(userId) {
        this.userId = userId;
        //const conn = new WebSocket('ws:localhost:8080/wss');
        this.conn = new WebSocket('ws:192.168.0.110:8080/wss');
        this.connect();
    }

    connect = () => {
        this.conn.onopen = (e) => {
            console.log("Connection established!");

            let msg = { // cria um objeto msg
                'userId': this.userId
            }
            msg = JSON.stringify(msg); //converte para json
            this.conn.send(msg);
        }

        this.conn.onclose = (e) => {
            console.log("Connection fechada!");
        };
    }


}
export { ConnectChat };