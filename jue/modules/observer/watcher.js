/**
 * 观察者 - 数据劫持
 *
 * @class Watcher
 */

import Dep from './dep.js';
import {
    parser
} from '../compile/parser.js';

export default class Watcher {
    constructor(exp, vm, cb) {
        this.exp = exp;
        this.vm = vm;
        this.cb = cb;
        this.oldVal = this.getOldVal();
    }
    /**
     ***
     * 对 Watcher 和 Dep 进行关联，同时记录初始值用于update时比较
     * 通过触发当前监听值的get方法
     *
     * @return {*} 
     * @memberof Watcher
     */
    getOldVal() {
        // 把当前watcher挂载到Dep对象上
        Dep.target = this;
        // 获取当前值，会触发get方法
        const oldVal = parser.getVal(this.exp, this.vm);
        // 重置target，避免Observer中触发再次触发get方法时，
        // 因为Dep.target还存在，所以dep.addSub又会给this.subs添加上一个记录的watcher，造成翻倍触发的现象
        // 为什么会翻倍？因为每一次set 都会触发notify，进而触发update，update中会取值而触发get，get又会再添加一个watcher
        // 所以set 1次，1个watcher 就会触发1次get，不清空Dep.target，get的时候会再次添加一个watcher
        // 再下一次set时，就有2个watcher同时触发，2个watcher就会触发2次notify，进而增加前面讲的增加2个watcher
        // 如此下来，set一次，2个watcher会导致新增2个watcher变4个，4个watcher就会导致新增4个watcher变8个，如此类推... 
        Dep.target = null;
        return oldVal;
    }
    /**
     * 更新数据
     *
     * @memberof Watcher
     */
    update() {
        // 实时获取最新值
        const newVal = parser.getVal(this.exp, this.vm);
        // 比较新值与旧值
        if (newVal !== this.oldVal) {
            // 执行回调
            this.cb(newVal, this.oldVal);
            // 更新旧值
            this.oldVal = newVal;
        }
    }
}