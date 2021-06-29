const debug = require('debug')('brig:runner');

class BrigRunner {

    #options = null;
    #runner = null;

    constructor(options) {
        debug('BrigRunner(...)');
        this.#options = options;

        // init runner
        // runner = new VM(options);
    }

    compile(code) {
        debug('BrigRunner compile(...)');

        throw new Error('Must extend BrigRunner override compile(code)!');
    }

    wrap(code) {
        debug('BrigRunner wrap(...)');

        // Example code wrapper

        const wrapped = `
        require, eval = () => { throw new Error('Function not permitted!') };
        {
            (() => {
                return (${code});
            }).call(null);
        }
        `;

        return wrapped;
    }

    run(code, context) {
        debug('BrigRunner run(...)');

        throw new Error('Must extend BrigRunner override run(code)!');
    }

}

module.exports = BrigRunner;