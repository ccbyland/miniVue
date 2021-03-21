/**
 * 实现Watch对象
 * 
 *  实现思路:
 *      1: 遍历watch列表
 *      2: 对不同格式watch对象单独处理
 *      3: 存在immediate属性的获取当前旧值立即执行一次cb
 *      4: 对每个watch对象进行监听-调用数据劫持
 *      5: 存在deep属性的,递归进行监听
 * 
 * @class Watch
 */

import Watcher from './observer/watcher.js';

export default class Watch {

    constructor(data, vm) {
        this.watch(data, vm);
    }
    /**
     * 监听数据
     *
     * @param {*} data
     * @param {*} vm
     * @memberof Watch
     */
    watch(data, vm) {

        // 获取ws
        const ws = vm.$options.watch;
        // 遍历所有watch的对象
        for (const key in ws) {

            // 当前watch对象
            const getter = ws[key];

            const {
                handler,
                immediate,
                deep
            } = getter;
            // 格式 a: {handler:xxx, parser:xxx, deep:xxx}
            if (typeof getter === 'object') {
                
                // 根据表达式获取对应的函数
                const fn = this.getFn(vm, handler).bind(vm);

                // immediate - 处理
                if(immediate){
                    // 获取当前值
                    const oldValue = parser.getVal(key, vm);
                    // 立即执行
                    fn && fn(undefined, oldValue);
                }
            }

            // 数据监听
            this.addWatcher(key, vm, getter, data, deep);
        }
    }
    /**
     * 数据监听
     *
     * @param {*} key
     * @param {*} vm
     * @param {*} getter
     * @param {*} data
     * @param {*} deep
     * @memberof Watch
     */
    addWatcher(key, vm, getter, data, deep) {
        
        // 监听数据更新
        new Watcher(key, vm, (newValue, oldValue) => {
            // 通知watch函数回调
            if (typeof getter === 'object') {
                const fn = this.getFn(vm, getter.handler);
                fn && fn(newValue, oldValue);
            } else {
                getter(newValue, oldValue);
            }
        });

        // 深度监听
        if (deep && typeof data[key] === 'object') {
            // 递归监听每一层属性
            Object.getOwnPropertyNames(data[key]).forEach(k => {
                this.addWatcher(`${key}.${k}`, vm, getter, data, deep);
            });
        }
    }
    /**
     * 根据表达式获取对应的函数
     *
     * @param {*} vm
     * @param {*} getter
     * @return {*} 
     * @memberof Watch
     */
    getFn(vm, getter) {

        // 格式 handler:xxx
        if (typeof getter === 'string') {
            return vm.$options.methods[getter];
        }

        // 格式 handler(){}
        if (typeof getter === 'function') {
            return getter;
        }
    }
}