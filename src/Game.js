const { v4: uuidv4 } = require('uuid');
const Player = require('./Player');
const axios = require('axios');
module.exports = class Game {
    constructor(ws, code) {
        this.ws = ws;
        this.players = [];
        this.code = code;
        this.id = uuidv4();
        ws.send(JSON.stringify({action: 'uid', data: {uid: this.id}}));
        this.getCode();
        this.questions = [];
    }

    message(message) {
        this.message = message;
        this[message.action]();
    }

    getCode() {
        this.ws.send(JSON.stringify({
            action: 'code',
            data: {
                code: this.code
            }
        }));

    }

    join(ws, msg) {
        this.players.push(new Player(ws, msg.data.name, this));
        this.ws.send(JSON.stringify({
            action: 'playerJoined', data: {
                name: msg.data.name
            }
        }));
    }

    start() {
        axios.get('https://opentdb.com/api.php', {
            params: {
                amount: 5,
                type: 'multiple'
            }
        }).then(res => {
            this.questions = res.data.results;
            this.sendQuestion(0);
        });

    }

    sendQuestion(index){
        this.questionIndex = index;
        this.players.forEach(player => {
            player.ws.send(JSON.stringify({action: 'start', data: {
                    options: this.shuffleArray([...this.questions[index].incorrect_answers, this.questions[index].correct_answer])
                }}))
        });
        this.ws.send(JSON.stringify({
            action: 'question', data: {
                question: this.questions[index].question
            }
        }));
        this.countdown();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    countdown(){
        this.timeout = setTimeout(()=>{
            clearInterval(this.interval);
            this.showScore();
        }, 31000);
        this.interval = setInterval(()=> {
            this.ws.send(JSON.stringify({
                action: 'timeout'
            }));
            this.players.forEach(player => {
                player.ws.send(JSON.stringify({action: 'timeout'}));
            });
        }, 1000);
    }
    showScore(){
        let score = this.players.map(player => {
            return {name: player.name, score: player.score};
        });
        this.ws.send(JSON.stringify({
            action: 'score', data: {
                score: score
            }
        }));
        if(this.questionIndex + 1 < this.questions.length) {
            this.timeout = setTimeout(() => {
                this.sendQuestion(++this.questionIndex);
            }, 10000);
        } else {
            this.ws.send(JSON.stringify({
                action: 'gameOver'
            }));
        }
    }
};