// list of valid module names
const MODULES = ['workerpool', 'debug', 'safe-buffer', 'stream'];

function require_worker(module) {
    if (!(MODULES.includes(module))) {
        throw new Error(`Invalid module: ${module}`);
    }
    return require(module);
}

// make our requires for the worker
const workerpool = require_worker('workerpool');
const {Buffer} = require_worker('safe-buffer');
const debug = require_worker('debug')('brig:worker');
// TODO: dynamic require based one main thread message ???
const {BrigRunnerVM2} = require('.');

const VM_OPTIONS = {
    timeout: process.env.WORKER_TIMEOUT === 'Infinity' ? undefined : 1000 * 60,
    require: {
        builtin: ['stream', 'http2'],
    }
};

let runner = new BrigRunnerVM2(VM_OPTIONS);

// monkey patch require to noop func
require, require_worker = () => {};

function workerExecute(code, context) {
    debug('workerExecute(...)');

    return runner.run(code, context);
}

function workerCompile(code) {
    debug('workerCompile(...)');

    return runner.compile(code);
}

workerpool.worker({
    execute: workerExecute,
    compile: workerCompile,
});