EventsObserver.js
========

[![Latest NPM release][npm-badge]][npm-badge-url]
[![License][license-badge]][license-badge-url]

### EventsObserver javascript template ###

**EventsObserver** template provides possibility to create custom events and trigger them.

You can create **events tree** and trigger event handlers in order that handlers were added. Also it works with async handlers.
If event handler returns promise next handler will be executed only if previous handler promise is resolved.

### What is EVENTS TREE ? ###

<img src="https://raw.githubusercontent.com/OleksandrKukla/events-observer/master/src/img/scheme.png" width="100%" style="display: block;">

[npm-badge]: https://img.shields.io/npm/v/events-observer.svg
[npm-badge-url]: https://www.npmjs.com/package/events-observer
[license-badge]: https://img.shields.io/npm/l/events-observer.svg
[license-badge-url]: ./LICENSE