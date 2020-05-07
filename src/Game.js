const helpers = require('./helpers');
const Player = require('./Player');
module.exports = class Game {
    constructor(ws, code) {
        this.ws = ws;
        this.players = [];
        this.code = code;
        this.id = helpers.uuidv4();
        ws.send(JSON.stringify({action: 'uid', data: {uid: this.id}}))
        this.getCode();
    }
    message(message) {
        this.message = message;
        if(message.sender === 'game'){
            this[message.action]();
        }
    }
    getCode(){
       this.ws.send(JSON.stringify({
            action: 'code',
            data: {
                code: this.code
            }
        }));

    }
    join(ws, msg){
        this.players.push(new Player(ws, msg.data.name));
        this.ws.send(JSON.stringify({action: 'playerJoined', data: {
                name: msg.data.name
            }
        }));
    }
    start(){
        this.players.forEach(player => {
            player.ws.send(JSON.stringify({action:'start'}))
        })
    }
};