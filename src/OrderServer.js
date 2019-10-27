class OrderServer {

    constructor() {
        this.__order = [];
        this.__processPromise = new Promise (resolve => resolve());
    }

    push(name, element) {
        this.__order.push(name);
        this[name] = element;
    }

    delete(name) {
        this.__processPromise.then(() => {
            let index = this.__order.findIndex(_name => _name === name);

            this.__order.splice(index, 1);
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

        this.__processPromise = new Promise (_resolve => {
            // open closure to resolve after async operations
            resolve = _resolve;
        });

        for (name of this.__order) {
            await callback(name, this[name]);
        }

        resolve();
    }
}

export default OrderServer;