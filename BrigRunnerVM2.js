const debug = require('debug')('brig:runner');
const BrigRunner = require('./BrigRunner.js');
const {VM} = require('vm2');

class BrigRunnerVM2 extends BrigRunner {

    #options = {
        timeout: process.env.BRIG_TIMEOUT === 'Infinity' ? undefined : 1000 * 60,
    };
    #runner = null;

    constructor(options, cb) {
        debug('BrigRunnerVM2(...)');
        super(options, cb);
        if (options) this.#options = options;

        // init runner
        this.#runner = this.#initRunner(options);

        if (cb) {
            cb(null, this);
        }
    }

    #initRunner(opt) {
        const runner = new VM(opt);
        return runner;
    }

    compile(code, cb) {
        debug('BrigRunnerVM2 compile(...)');

        const err = new Error('NYI!');
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
        debug('BrigRunnerVM2 wrap(...)');

        // Example code wrapper

        const wrapped = `
        const sandbox = sandbox || {};
        ((sandbox) => {
            return ({${code}});
        }).call(sandbox, sandbox);
        `;

        if (cb) {
            debug('BrigRunnerVM2 wrapped');
            cb(null, wrapped);
            return this;
        }
        else {
            throw err;
        }
    }

    run(code, context, cb) {
        debug('BrigRunnerVM2 run(...)');

        // TODO: create vm sandbox data from context
        const ret = this.#runner.run(code);
        debug('BrigRunnerVM2 ran');
        if (cb) {
            cb(null, ret);
            return this;
        }
        else {
            return ret;
        }
    }

}

module.exports = BrigRunnerVM2;