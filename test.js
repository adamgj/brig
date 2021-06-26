const {Brig} = require('.');

// TODO: replace hardcoded test

const brig = new Brig();

brig
    .open()
    .send('Math.random();', {msg: 'hello world'}, response);

function response(err, resp) {
    console.log(resp);
    brig.close();
}