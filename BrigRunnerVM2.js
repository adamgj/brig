const debug = require('debug')('brig:runner');
const BrigRunner = require('./BrigRunner.js');
const {VM, VMScript} = require('vm2');

class BrigRunnerVM2 extends BrigRunner {

    #options = {
        timeout: process.env.BRIG_TIMEOUT === 'Infinity' ? undefined : 1000 * 60,
        fixAsync: true,
        eval: false,
        wasm: false,
    };
    #runner = null;

    constructor(options) {
        debug('BrigRunnerVM2(...)');
        super(options);
        if (options) this.#options = options;

        // init runner
        this.#runner = this.#initRunner(options);

        debug('BrigRunnerVM2 constructed');
    }

    #initRunner(opt) {
        const runner = new VM(opt);
        return runner;
    }

    compile(code) {
        debug('BrigRunnerVM2 compile(...)');

        const script = new VMScript(code);

        debug('BrigRunnerVM2 compiled');
        return script;
    }

    wrap(code) {
        debug('BrigRunnerVM2 wrap(...)');

        // Example code wrapper

        const wrapped = `
        ((context) => {
            return ${code};
        })(brig || { context: {}, date: new Date(), brig: true });
        `;

        debug('BrigRunnerVM2 wrapped');
        return wrapped;
    }

    run(code, context) {
        debug('BrigRunnerVM2 run(...)');

        code = this.wrap(code);
        if (context) this.#runner.freeze({ context, date: new Date(), brig: true }, 'brig');
        code = this.compile(code);
        const ret = this.#runner.run(code);

        debug('BrigRunnerVM2 ran');
        return ret;
    }

}

module.exports = BrigRunnerVM2;