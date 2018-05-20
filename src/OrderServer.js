const _order = Symbol('_order');
const _processPromise = Symbol('_processPromise');

class OrderServer {

    constructor() {
        this[_order] = [];
        this[_processPromise] = new Promise (resolve => resolve());
    }

    push(name, element) {
        this[_order].push(name);
        this[name] = element;
    }

    delete(name) {
        this[_processPromise].then(() => {
            let index = this[_order].findIndex(_name => _name === name);

            this[_order].splice(index, 1);
            delete this[name];
        });
    }

    check(name) {
        return this.hasOwnProperty(name);
    }

    getItem(name) {
        return this[name];
    }

    async eachInOrder(callback) {
        let resolve = () => {};

        this[_processPromise] = new Promise (_resolve => {
            // open closure to resolve after async operations
            resolve = _resolve;
        });

        for (name of this[_order]) {
            await callback(name, this[name]);
        }

        resolve();
    }
}

export default OrderServer;