const Game = require('./Game');
module.exports = class GameList {

    constructor(ws) {
        this.games = [];
    }

    new(ws){
        this.games.push(new Game(ws, this.generateCode()));
    }
    find(id) {
       return this.games.find(game => game.id===id);
    }
    join(ws, msg){
       let game = this.games.find(game => game.code===msg.data.code);
       game.join(ws, msg);
    }
    generateCode(){
        let codes = this.games.map(game => game.code);
        let code = this.getCode();
        while(codes.includes(code)){
            code = this.getCode();
        }
        return code;
    }

    getCode(){
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let charactersLength = characters.length;
        for ( let i = 0; i < 4; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    message(msg){
        if(msg.sender === 'game') {
            this.find(msg.id).message(msg);
        }
        if(msg.sender === 'player') {
            let players = [];
            this.games.forEach(game => players.push(...game.players));
            let player = players.find(player => player.id === msg.id);
            player[msg.action](msg.data);
        }
    }
};