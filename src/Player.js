const { v4: uuidv4 } = require('uuid');
module.exports = class Player {
    constructor(ws, name, game) {
        this.name = name;
        this.ws = ws;
        this.id = uuidv4();
        this.game = game;
        this.score=0;
        ws.send(JSON.stringify({action: 'uid', data: {uid: this.id}}))
    }
    answer(data){
        if(data.answer === this.game.questions[this.game.questionIndex].correct_answer){
            this.score +=1000;
        }
    }
};