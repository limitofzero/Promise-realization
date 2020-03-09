// todo возврат Promise из then/catch/resolve

export class Promise$ {
    constructor(callback) {
        this._status = 0; // 0 - pending, 1 - resolved, 2 - rejected
        this._value = null;
        this._reject = this._reject.bind(this);
        this._resolve = this._resolve.bind(this);
        this._onHandle = this._noop;

        if (callback) {
            this._handle(callback);
        } else {
            throw new Error('Callback is not defined!');
        }
    }

    static resolve(value) {
        return new Promise$(resolve => resolve(value));
    }

    static reject(value) {
        return new Promise$((resolve, reject) => reject(value));
    }

    static all(promises) {
        const length = promises.length;
        const resolved = new Array(length);
        let resolvedCount = 0;

        return new Promise$((resolve, reject) => {
            if (promises.length === 0) {
                resolve(resolved);
            }

            promises.forEach((promise, index) => {
                promise.then(value => resolved[index] = value)
                    .then(() => {
                        if (++resolvedCount === promises.length) {
                            resolve(resolved);
                        }
                    })
                    .catch(e => reject(e));
            });
        });
    }

    static race(promises) {
        if (promises.length === 0) {
            resolve(resolved);
        }

        return new Promise$((resolve, reject) => {
            promises.forEach(promise => {
                promise.then(value => resolve(value))
                    .catch(e => reject(e));
            });
        });
    }

    _noop() {}

    _handle(callback) {
        try {
            callback(this._resolve, this._reject);
        } catch (e) {
            this._reject(e);
        }
    }

    _resolve(value) {
        if (this._status === 0) {
            this._value = value;
            this._status = 1;
            this._onHandle();
        }
    }

    _reject(err) {
        if (this._status === 0) {
            this._value = err;
            this._status = 2;
            this._onHandle();
        }
    }

    then(successCallback, rejectCallback) {
        successCallback = successCallback || this._noop;
        rejectCallback = rejectCallback || this._noop;
        return this._returnNewPromiseAndHandleCallback(successCallback, rejectCallback);
    }

    _returnNewPromiseAndHandleCallback(successCb, rejectCb, finallyCb) {
        return new Promise$((resolve, reject) => {
            if (this._status === 0) {
                this._onHandle = () => {
                    this._asyncExecuteCallbackAndResolve(successCb, rejectCb, resolve, reject, finallyCb);
                }
            } else {
                this._asyncExecuteCallbackAndResolve(successCb, rejectCb, resolve, reject, finallyCb);
            }
        });
    }

    _asyncExecuteCallbackAndResolve(successCb, rejectCb, resolve, reject, finallyCb) {
        setTimeout(() => {
            try {
                let callbackResult;
                if (this._status === 1) {
                    callbackResult = successCb(this._value);
                } else {
                    callbackResult = rejectCb(this._value);
                }

                resolve(callbackResult);
            } catch (e) {
                reject(e);
            } finally {
                if (finallyCb) {
                    finallyCb();
                }
            }
        });
    }

    catch(errorCb) {
        return this.then(null, errorCb);
    }

    finally(finallyCb) {
        const successCb = () => this._value;
        const rejectCb = () => this._value;
        return this._returnNewPromiseAndHandleCallback(successCb, rejectCb, finallyCb);
    }
}
