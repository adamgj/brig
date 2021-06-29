const {Brig} = require('.');

// TODO: replace hardcoded test

const brig = new Brig();

brig
    .open()
    .send('Math.random() + 1', {msg: 'hello world'}, response)
    .send('brig.context.msg', {msg: 'hello world'}, response)
    .send('brig.context.msg;', {msg: '2nd'}, response);

function response(err, resp) {
    console.log(resp);
}