// list of valid module names
const MODULES = ['workerpool', 'vm2', 'debug', 'safe-buffer', 'stream', 'math'];

function require_worker(module) {
    if (!(MODULES.includes(module))) {
        throw new Error(`Invalid module: ${module}`);
    }
    return require(module);
}

// make our requires for the worker
const workerpool = require_worker('workerpool');
const {VM} = require_worker('vm2');
const {Buffer} = require_worker('safe-buffer');
const debug = require_worker('debug')('brig:worker');

const VM_OPTIONS = {
    timeout: process.env.WORKER_TIMEOUT === 'Infinity' ? undefined : 1000 * 60,
    require: {
        builtin: ['math', 'stream', 'http2'],
    }
};

// monkey patch require to noop func
require, require_worker = () => {};

function workerExec(code, data) {
    debug('workerExec');

    const opts = VM_OPTIONS;
    opts.sandbox = {
        data,
    };
    const vm = new VM(opts);

    debug('workerExec vm run done');

    return vm.run(code);
}

workerpool.worker({
    exec: workerExec,
});