import Dep from '../observer/dep.js';
import Watcher from './watcher.js';
import { noop } from '../../../shared/util.js';

/**
 * 实现Computed对象
 *
 * @export
 * @class Computed
 */

const computedWatcherOptions = {
    lazy: true
}
export default class Computed {

    constructor(vm) {
        this.computed(vm);
    }
    computed(vm) {
        const cs = vm.$options.computed;
        const watchers = vm._computedWatchers = Object.create(null);
        Object.getOwnPropertyNames(cs).forEach(aaa => {
            const c = cs[aaa];
            const getter = typeof c === 'function' ? c : c.get;
            // 创建一个监听器
            watchers[aaa] = new Watcher(
                vm,
                getter || noop,
                noop,
                computedWatcherOptions,
                true,
                'computed watcher'
            );
            // 代理计算属性 前提是在data, prop, methods 上不存在
            if (!(aaa in vm)) {
                this.defineComputed(vm, aaa, getter);
            }
        });
    }
    /**
     * 代理计算属性
     *
     * @param {*} vm
     * @param {*} aaa
     * @memberof Computed
     */
    defineComputed(vm, aaa) {
        Object.defineProperty(vm, aaa, {
            get: function () {
                debugger
                // 拿到当前对象的watcher
                const watcher = vm._computedWatchers && vm._computedWatchers[aaa];
                // 缓存控制
                // 如果 computed 依赖的数据变化，dirty 会变成true，
                // 从而重新计算，然后更新缓存值 watcher.value
                if (watcher.dirty) {
                    // 求值
                    watcher.evaluate();
                }

                // get计算属性时，会进行一次依赖收集
                if (Dep.target) {
                    watcher.depend();
                }
                // 返回值
                return watcher.value;
            }
        });
    }
}