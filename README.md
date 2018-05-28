EventsObserver.js
========

[![Latest NPM release][npm-badge]][npm-badge-url]
[![License][license-badge]][license-badge-url]

### EventsObserver javascript template ###

**EventsObserver** template provides possibility to create custom events and trigger them. 
You can organize events to events tree. Trigger, add and delete events handlers. 
Return promise in event handler to call async handlers in the order. 

### Install ###
Install using npm 
```
npm i -s events-observer
```
and then import constructor from `events-observer` npm module

**or**

download `EventsObserver.min.js` file from this repository root and include it to html (ES5 usage, this is last built version):
```html
<script src="EventsObserver.min.js"></script>
```

### Usage ###
If you have imported es6+ EventsObserver module
```javascript
import EventsObserver from 'events-observer';
```
or loaded it using `script tag`, you should create instance of EventsObserver constructor.

```javascript
var observer = new EventsObserver();
```

Also, you can pass `separator` property to define how events patch should be parsed.
By default events path separator is `.` and your events path should looks like:
```javascript
var observer = new EventsObserver();
observer.on('event_1.sub-event_1.sub-event_1_1', ...);
```
but if you change separator setting, for example to "/", it will looks like:
```javascript
var observer = new EventsObserver('/');
observer.on('event_1/sub-event_1/sub-event_1_1', ...);
```

You can create **events tree** and trigger event handlers in order that handlers were added. Also it works with async handlers.
If event handler returns promise next handler will be executed only if previous handler promise is resolved.

### What is EVENTS TREE ? ###

<img src="https://raw.githubusercontent.com/OleksandrKukla/events-observer/master/src/img/scheme.png" width="100%" style="display: block;">

[npm-badge]: https://img.shields.io/npm/v/events-observer.svg
[npm-badge-url]: https://www.npmjs.com/package/events-observer
[license-badge]: https://img.shields.io/npm/l/events-observer.svg
[license-badge-url]: ./LICENSE