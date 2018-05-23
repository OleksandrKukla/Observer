import Observer from "./Observer";

// temp easy test

let o = new Observer();

o.on('event_1.event_1_1', function (x) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('event_1_1_1');
            resolve(x);
        }, 2000);
    });
});

o.on('event_1.event_1_2', function (x) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('event_1_2_1');
            resolve(x);
        }, 2000);
    });
});

o.on('event_1.event_1_2', function (x) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('event_1_2_2');
            resolve(x);
        }, 2000);
    });
});

o.on('event_1.event_1_1', function (x) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('event_1_1_2');
            resolve(x);
        }, 2000);
    });
});

o.on('event_1.event_1_1', function (x) {
    console.log('event_1_1_3 not async');
});

o.on('event_1.event_1_1', function (x) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('event_1_1_4');
            resolve(x);
        }, 2000);
    });
});

o.on('event_1.event_1_1.event_1_1__1', function (x) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('event_1_1__1');
            resolve(x);
        }, 2000);
    });
});

o.on('event_1.event_1_1.event_1_1__1', function (x) {
    console.log('event_1_1__2 not async');
});

o.on('event_1.event_1_1.event_1_1__1', function (x) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('event_1_1__3');
            resolve(x);
        }, 2000);
    });
});
o.trigger('event_1');