import OrderServer from './OrderServer';

const _separator = Symbol('_separator');
const _state = Symbol('_handlersState');
const _handlerPrefix = Symbol('_handlerPrefix');
const _prefix = Symbol('_prefix');
const _handlerCounter = Symbol('_handlerCounter');


class Observer {

    constructor(
        separator = '.',
        prefix = '__handler_id_'
    ) {
        // init private
        this[_separator] = separator;
        this[_state] = new OrderServer();
        this[_prefix] = prefix;
        this[_handlerCounter] = 0;
    }

    _createHandlerId() {
        return (this[_prefix] + (this[_handlerCounter]++));
    }

    _createHandlerObject(handler, callLimit) {
        return {
            handlerId: this._createHandlerId(),
            handler,
            callLimit,
            callCounter: 0
        };
    }

    _pathParser(eventPath) {
        let pathArray;

        if (typeof eventPath !== 'string') {
            throw new Error(`Event path type isn't correct (${typeof eventPath}), expected type - string`);
        }

        pathArray = eventPath.split(this[_separator]);

        if (pathArray.findIndex(value => value === '') !== -1) {
            throw new Error('Event path can\'t consists of empty values');
        }

        return pathArray;
    }

    _addHandler(path, handlerObject, state = this[_state]) {
        let isLast = (path.length <= 1),
            eventName = path.shift(), // returns first element and
            newState;

        if (!state.check(eventName)) {
            state.push(
                eventName,
                new OrderServer()
            );
        }

        newState = state.get(eventName);

        if (isLast) {
            newState.push(handlerObject.handlerId, handlerObject);
        } else {
            this._addHandler(path, handlerObject, newState);
        }
    }

    _removeEvent (path, state = this[_state]) {
        let isLast = (path.length <= 1),
            eventName = path.shift(), // returns first element and
            newState;

        if (isLast) {
            state.delete(eventName);
        } else {
            newState = state.get(eventName);
            this._removeEvent(path, newState);
        }
    }

    // PUBLIC

    on(event, handler, callLimit = null) {
        let eventPath = this._pathParser(event),
            handlerObject = this._createHandlerObject(handler, callLimit);

        this._addHandler(eventPath, handlerObject);
    }

    off(event) {
        let eventPath = this._pathParser(event);

        this._removeEvent(eventPath);
    }

    once(event, handler) {

    }

    trigger(event) {

    }
}

window.Observer = Observer;
window.OrderServer = OrderServer;

export default Observer;