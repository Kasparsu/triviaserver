const helpers = require('./helpers');
module.exports = class Player {
    constructor(ws, name, game) {
        this.name = name;
        this.ws = ws;
        this.id = helpers.uuidv4();
        this.game = game;
        this.score=0;
        this.hints = {
            fiftyFifty: {
                type: 'fiftyFifty',
                available: true,
                name: 'Fifty Fifty'
            },
        }
        ws.send(JSON.stringify({action: 'uid', data: {uid: this.id}}))
    }
    answer(data){
        if(data.answer === this.game.questions[this.game.questionIndex].correct_answer){
            this.score +=1000;
        }
    }
    getHint(data) {
        if(this.hints[data.type].available) {
            if(data.type === 'fiftyFifty') {
                this.hints[data.type].available = false;

                const questions = this.game.questions;
                const questionIndex = this.game.questionIndex;
                const incorrectAnswers = questions[questionIndex].incorrect_answers;
                const incorrectAnswer = incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];
                const shuffledAnswers = this.game.shuffleArray([incorrectAnswer, questions[questionIndex].correct_answer]);

                this.ws.send(JSON.stringify({action: 'hint', data: {type: data.type, options: shuffledAnswers}}));
            }
        }
    }
};