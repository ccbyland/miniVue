/**
 * 观察者 - 数据劫持
 *
 * @export
 * @class watcher
 */

import Dep from '../observer/dep.js';

export default class watcher {

    /**
     * 建立一个监听器 
     * 
     * @param {*} vm
     * @param {*} getter
     * @param {*} cb
     * @param {*} options
     * @memberof watcher
     */
    constructor(vm, getter, cb, options, flag, name) {
        // 
        this.vm = vm;

        // 是否惰性求值
        if(options){
            this.lazy = !!options.lazy;
        }else{
            this.lazy = false;
        }
        this.name = name;
        // 用于控制缓存
        this.dirty = this.lazy;
        // 求值方法
        this.getter = getter;
        // 返回初始值
        this.value = this.lazy ? undefined : this.get();

        this.deps = [];
        this.cb = cb;
    }
    /**
     * 实时计算value
     */
    evaluate() {
        // 求值
        this.value = this.get();
        // 重置为false
        // 用于控制缓存，后续如若依赖没有发生set，则这里一直都是读的缓存
        // 也就是说，computed的缓存受制于依赖的更新
        this.dirty = false;
    }
    /**
     * 求值
     * 
     * 通过求值会触发依赖对象的get方法特性
     * 在这里跟依赖对象建立关系，把当前计算属性的watcher丢给属性的get，
     * 属性触发set时调用watcher触发更新
     *
     * @return {*} 
     * @memberof watcher
     */
    get() {

        Dep.target = this;

        const val = this.getter.call(this.vm);

        Dep.target = null;

        return val;
    }
    /**
     * 更新方法
     *
     * @memberof watcher
     */
    update() {

        if(this.lazy){
            this.dirty = true;
        }
    }
    /**
     * 依赖收集
     *
     * @memberof watcher
     * 
     * 页面watcher读取computed属性时，步骤如下：
     * 1.因为this.lazy为null，从而执行getVal方法，将页面watcher暂存到Dep.target中
     * 2.
     */
    depend(){
        const i = this.subs.length;
        while(i--){
            dep.addSub(Dep.target);
        }
    }
}