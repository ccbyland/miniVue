import Dep from './dep.js';
import { isObject } from '../util/index.js';
export default function observe(value) {

    if(!isObject(value)){
        return;
    }
    return new Observer(value);
}

export class Observer {

    constructor(value) {
        this.walk(value);
    }
    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    }
}

export function defineReactive(obj, key) {

    const dep = new Dep();
    let val = obj[key];

    let childOb = observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            if (Dep.target) {
                dep.depend();
            }
            if(childOb){
                childOb.dep.depend();
            }
            return val;
        },
        set: function reactiveSetter(newVal) {
            if (newVal === val) {
                return;
            }
            val = newVal;
            if (childOb) {
                observe(newVal);
            }
            dep.notify();
        }
    })
}