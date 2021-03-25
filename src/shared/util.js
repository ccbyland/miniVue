const hasOwnProperty = Object.prototype.hasOwnProperty;

export function noop() {}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
export function toString(val) {
    return val === null ? '' : typeof val === 'object' ? JSON.stringify(val) : String(val);
}

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
}

export function bind(fn, ctx) {
    return fn.bind(ctx);
}

export function log(msg, level) {
    const fn = level ? level : 'info';
    if (typeof msg === 'object') {
        const [msg1, msg2] = msg;
        console[fn](msg1, msg2);
    } else {
        console[fn](`%c${level ? '' : '[ Vue Log ]'}`, 'color:red;', msg);
    }
}