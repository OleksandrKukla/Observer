import OrderServer from './OrderServer';

class Observer {

    constructor(
        separator = '.',
        prefix = '__handler_id_'
    ) {
        this.__separator = separator;
        this.__state = new OrderServer();
        this.__prefix = prefix;
        this.__handlerCounter = 0;
    }

    __createHandlerId() {
        return (this.__prefix + (this.__handlerCounter++));
    }

    __createHandlerObject(handler, callLimit) {
        return {
            handlerId: this.__createHandlerId(),
            handler,
            callLimit,
            callCounter: 0
        };
    }

    __parsePath(eventPath) {
        let pathArray;

        if (typeof eventPath !== 'string') {
            throw new Error(`Event path type isn't correct (${typeof eventPath}), expected type - string`);
        }

        pathArray = eventPath.split(this.__separator);

        if (pathArray.findIndex(value => value === '') !== -1) {
            throw new Error('Event path can\'t consists of empty values');
        }

        return pathArray;
    }

    __walkRecursive({
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
            this.__walkRecursive({
                path,
                createIfEmpty,
                state,
                destinationCallback,
                params
            });
        }
    }

    __callTreeRecursive ({state, eventName, params}) {
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
        let path = this.__parsePath(event),
            handlerObject = this.__createHandlerObject(handler, callLimit);

        this.__walkRecursive({
            path,
            createIfEmpty: true,
            state: this.__state,
            destinationCallback: ({state, eventName}) => {
                let newState = state.getItem(eventName);
                newState.push(handlerObject.handlerId, handlerObject);
            }
        });
    }

    off(event) {
        let path = this.__parsePath(event);

        this.__walkRecursive({
            path,
            state: this.__state,
            destinationCallback: ({state, eventName}) => {
                state.delete(eventName);
            }
        });
    }

    once(event, handler) {
        this.on(event, handler, 1);
    }

    trigger(event, params) {
        let path = this.__parsePath(event);

        this.__walkRecursive({
            path,
            state: this.__state,
            params,
            destinationCallback: this.__callTreeRecursive
        });
    }
}

export default Observer;