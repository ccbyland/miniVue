export function noop() {}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
}

export function bind(fn, ctx) {
    return fn.bind(ctx);
}

export function log(msg1 = '', msg2 = '') {
    console.log('[ Vue Log]: ' + msg1, msg2);
}

export function warn(msg1 = '', msg2 = '') {
    console.warn('[ Vue Log]: ' + msg1, msg2);
}