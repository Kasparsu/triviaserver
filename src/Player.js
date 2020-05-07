const helpers = require('./helpers');
module.exports = class Player {
    constructor(ws, name) {
        this.name = name;
        this.ws = ws;
        this.id = helpers.uuidv4();
        ws.send(JSON.stringify({action: 'uid', data: {uid: this.id}}))
    }

};