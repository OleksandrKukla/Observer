import OrderServer from './OrderServer';

const _separator = Symbol('_separator');
const _state = Symbol('_handlersState');
const _handlerPrefix = Symbol('_handlerPrefix');
const _prefix = Symbol('_prefix');
const _handlerCounter = Symbol('_handlerCounter');
const _createHandlerId = Symbol('_createHandlerId');
const _createHandlerObject = Symbol('_createHandlerObject');
const _parsePath = Symbol('_parsePath');
const _walkRecursive = Symbol('_walkRecursive');
const _callTreeRecursive = Symbol('_callTreeRecursive');


class Observer {

    constructor(
        separator = '.',
        prefix = '__handler_id_'
    ) {
        this[_separator] = separator;
        this[_state] = new OrderServer();
        this[_prefix] = prefix;
        this[_handlerCounter] = 0;
    }

    [_createHandlerId]() {
        return (this[_prefix] + (this[_handlerCounter]++));
    }

    [_createHandlerObject](handler, callLimit) {
        return {
            handlerId: this[_createHandlerId](),
            handler,
            callLimit,
            callCounter: 0
        };
    }

    [_parsePath](eventPath) {
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

    [_walkRecursive]({
        path,
        createIfEmpty,
        state,
        destinationCallback,
        params
    }) {
        let isLast = (path.length <= 1),
            eventName = path.shift(), // returns first element
            hasEvent = state.check(eventName);

        if (!hasEvent && createIfEmpty) {
            state.push(
                eventName,
                new OrderServer()
            );

            hasEvent = true;
        }

        if (isLast) {
            hasEvent && destinationCallback({state, eventName, params});
        } else {
            state = state.getItem(eventName);
            this[_walkRecursive]({
                path,
                createIfEmpty,
                state,
                destinationCallback,
                params
            });
        }
    }

    [_callTreeRecursive] ({state, eventName, params}) {
        // to avoid context issue
        let _callTreeRecursive = ({state, eventName, params}) => {

            return new Promise(async resolve => {

                state = (eventName && state[eventName])
                    ? state[eventName]
                    : state;

                await state.eachInOrder(async function (name, element) {
                    if (element.handler) {
                        await element.handler(params);
                        ++element.callCounter;

                        if (
                            element.callLimit
                            && element.callCounter >= element.callLimit
                        ) {
                            state.delete(name);
                        }

                    } else {
                        // it is event, try recursion again
                        await _callTreeRecursive({state: element, params});
                    }
                });

                resolve();
            });
        };

        _callTreeRecursive({state, eventName, params});
    }

    on(event, handler, callLimit = null) {
        let path = this[_parsePath](event),
            handlerObject = this[_createHandlerObject](handler, callLimit);

        this[_walkRecursive]({
            path,
            createIfEmpty: true,
            state: this[_state],
            destinationCallback: ({state, eventName}) => {
                let newState = state.getItem(eventName);
                newState.push(handlerObject.handlerId, handlerObject);
            }
        });
    }

    off(event) {
        let path = this[_parsePath](event);

        this[_walkRecursive]({
            path,
            state: this[_state],
            destinationCallback: ({state, eventName}) => {
                state.delete(eventName);
            }
        });
    }

    once(event, handler) {
        this.on(event, handler, 1);
    }

    trigger(event, params) {
        let path = this[_parsePath](event);

        this[_walkRecursive]({
            path,
            state: this[_state],
            params,
            destinationCallback: this[_callTreeRecursive]
        });
    }
}

export default Observer;