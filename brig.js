const debug = require('debug')('brig');
const fastq = require('fastq');
const workerpool = require('workerpool');

const WORKER_FILENAME = __dirname + '/worker.js';
const WORKER_OPTIONS = {
    minWorkers: process.env.MIN_WORKERS === 'max' ? 'max' : 1,
    maxQueueSize: process.env.MAX_QUEUE_SIZE === 'Infinity' ? Infinity : 255,
    workerType: process.env.WORKER_TYPE || 'auto',
};

function createQueue(worker, concurrency) {
    const queue = fastq(worker, concurrency);
    return queue;
}

function createWorkerPool(worker, options) {

    return workerpool.pool(worker, options);
}

function error(msg = 'Brig Unknown Error', throwErr = true) {
    // TODO: detect Error / String
    const err = new Error(msg);
    debug(err);
    // TODO: detect Promise / Function (callback) / false
    if (throwErr) throw err;
    return err;
}

class Brig {

    //private vars
    #closed = true;
    #queue = null;
    #workerpool = null;

    //public vars
    timeout = process.env.WORKER_TIMEOUT === 'Infinity' ? Infinity : 1000 * 60;

    // private methods
    #exec(code, data) {
        return new Promise((respond, reject) => {
            debug('#exec(...)');

            this.#workerpool.exec('execute', [code, data])
                // .timeout(timeout)
                .then((resp) => {
                    debug('#exec(...) resp');
                    return respond(resp);
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    };

    #queueWorker(arg, callback) {
        debug('#queueWorker(...) #exec');

        this.#exec(arg.code, arg.data)
            .then((resp) => {
                debug('#queueWorker(...) #exec resp');
                if (callback) callback(null, resp);

                // TODO: trigger response event
            })
            .catch((err) => {
                debug(err);

                error(err, !callback);
                if (callback) callback(err);
                // TODO: trigger err event
            });
    }

    // public methods
    // TODO: decide API
    send(code, data, callback) {
        debug('send(...)');

        if (this.#closed) {
            error('send fail: brig closed', !callback);
            if (callback) callback(err);
        }

        debug('send(...) queue push');
        this.#queue.push({code, data}, (err, resp) => {
            debug('send(...) queue push resp');
            return callback(err, resp);
        });

        return this;
    }

    open() {
        debug('open()');

        if (!this.#queue) {
            debug('open() create queue');
            //TODO: figure out queue concurrency
            this.#queue = createQueue(this, this.#queueWorker, 3);
        }
        else {
            if (this.#queue.resume) this.#queue.resume();
        }

        if (!this.#workerpool) {
            this.#workerpool = createWorkerPool(WORKER_FILENAME, WORKER_OPTIONS);
        }

        this.#closed = false;
        return this;
    }

    close(hard) {
        debug('close(%s)', !!hard);
        this.#closed = true;
        if (this.#queue) this.#queue.pause();
        if (hard) {
            if (this.#queue) this.#queue.killAndDrain ? this.#queue.killAndDrain() : this.#queue.kill();
            if (this.#workerpool) this.#workerpool.terminate();
        }
        else {
            // TODO: let queue try to drain naturally with a time limit
        }

        return this;
    }

    isOpen() {
        return !this.#closed;
    }

};

module.exports = Brig;