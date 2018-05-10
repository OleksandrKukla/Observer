const _order = Symbol('_order');

class OrderServer {
    constructor () {
        this[_order] = [];
    }

    push(name, element) {
        this[_order].push(name);
        this[name] = element;
    }

    delete(name) {
        let index = this[_order].findIndex(_name => _name === name);

        this[_order].splice(index, 1);
        delete this[name];
    }

    check (name) {
        return this.hasOwnProperty(name);
    }

    get (name) {
        return this[name];
    }
}

export default OrderServer;