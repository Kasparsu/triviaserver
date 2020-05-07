const WebSocket = require('ws');
const Game = require('../src/Game');
const wss = new WebSocket.Server({ port: 8080 });
const GameList = require('../src/GameList');
let games = new GameList(wss);

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {

        let msg = JSON.parse(message);
        console.log('received: %s', msg);
        if(msg.sender === 'game'){
            if(msg.id === undefined){
                games.new(ws);
            } else {
                games.message(msg);
            }
        }
        if(msg.sender === 'player' && msg.id === undefined){
            games.join(ws, msg);
        }

    });
});