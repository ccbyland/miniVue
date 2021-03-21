import observe from '../observe/index.js';
import {
    noop,
    hasOwn,
    bind,
    warn
} from '../util/index.js';

export function stateMixin(Vue) {

    Vue.prototype.$set = function () {};
    Vue.prototype.$delete = function () {};
    Vue.prototype.$watch = function () {};
}

const sharedPropertyDefinition = {
    enumerable: true, // 是否可枚举
    configurable: true, // 描述符是否能改变
    get: noop,
    set: noop
}

export function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function () {
        return target[sourceKey][key];
    }
    sharedPropertyDefinition.set = function (val) {
        target[sourceKey][key] = val;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
}

export function initState(vm) {

    const opts = vm.$options;
    if (opts.props) {
        initProps(vm, opts.props);
    }
    if (opts.methods) {
        initMethods(vm, opts.methods);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm, opts.computed);
    }
    if (opts.watch) {
        initWatch(vm, opts.watch);
    }
}

function initProps() {}

function initMethods(vm, methods) {

    const props = vm.$options.props;

    for(const key in methods){

        if(typeof methods[key] !== 'function'){
            warn(`Method ${key} 为 ${methods[key]} 类型`);
        }

        if(props && hasOwn(props, key)){
            warn(`Method ${key} 已声明为属性`);
        }
        vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
}

function initData(vm) {

    let data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm, vm) : data || {};

    const keys = Object.keys(data);
    const props = vm.$options.props;
    let i = keys.length;
    while (i--) {
        const key = keys[i];
        if (props && hasOwn(props, key)) {
            warn(`数据属性 ${key} 已声明为属性`);
        } else {
            proxy(vm, '_data', key);
        }
    }
    observe(data);
}

function initComputed() {}

function initWatch() {}