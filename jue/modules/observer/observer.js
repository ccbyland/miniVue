/**
 * 监听器
 *
 * @class Observer
 */

import Dep from './dep.js';

export default class Observer {
    constructor(data) {
        this.observer(data);
    }
    /**
     * 监听data对象所有值
     *
     * @param {*} data
     * @memberof Observer
     */
    observer(data) {
        if (data && typeof data === 'object') {
            // 遍历所有数据
            Object.keys(data).forEach((key) => {
                // 数据劫持
                this.defineReactive(data, key, data[key]);
            });
        }
    }
    /**
     * 数据劫持
     *
     * @param {*} obj
     * @param {*} key
     * @param {*} value
     * @memberof Observer
     */
    defineReactive(obj, key, value) {
        // 递归监听数据
        this.observer(value);
        // 创建一个观察者容器
        // 一个vm实例对象中的data对象每一个属性 => dep对象
        const dep = new Dep();

        // 劫持数据
        Object.defineProperty(obj, key, {
            /**
             * 当且仅当该属性的 enumerable 键值为 true 时，
             * 该属性才会出现在对象的枚举属性中。
             * 默认为 false。
             */
            enumerable: true,
            /**
             * 当且仅当该属性的 configurable 键值为 true 时，
             * 该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
             * 默认为 false。
             */
            configurable: false,
            get: () => {
                // 订阅数据更新
                // 在当前数据变化时，需要通知所以订阅者更新数据
                // 为什么写在get方法而不是set方法中？
                // 因为data中的属性，如果没有被引用，就算set也不应该触发watcher
                // 而get是存在引用关系的，所以在这里进行广播
                Dep.target && dep.addSub(Dep.target);
                // 返回值
                return value;
            },
            set: (newVal) => {
                if (newVal === value) {
                    return;
                }
                // 赋值
                value = newVal;
                // 对新值（可能是对象）进行监听
                this.observer(newVal);
                // 通知更新
                dep.notify();
            },
        });
    }
}