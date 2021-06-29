const debug = require('debug')('brig:runner');

class BrigRunner {

    #options = null;
    #runner = null;

    constructor(options, cb) {
        debug('BrigRunner(...)');
        this.#options = options;

        // init runner
        // runner = new VM(options);
    }

    compile(code, cb) {
        debug('BrigRunner compile(...)');

        const err = new Error('Must extend BrigRunner override compile(code, cb)!');
        if (cb) {
            debug(err);
            cb(err);
            return this;
        }
        else {
            throw err;
        }
    }

    wrap(code, cb) {
        debug('BrigRunner wrap(...)');

        // Example code wrapper

        const wrapped = `
        {
            (() => {
                return (${code});
            }).call(null);
        }
        `;

        if (cb) {
            debug('BrigRunner wrapped');
            cb(null, wrapped);
            return this;
        }
        else {
            throw err;
        }
    }

    run(code, context, cb) {
        debug('BrigRunner run(...)');

        const err = new Error('Must extend BrigRunner override run(code, cb)!');
        if (cb) {
            debug(err);
            cb(err);
            return this;
        }
        else {
            throw err;
        }
    }

}

module.exports = BrigRunner;