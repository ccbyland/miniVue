import {
    noop
} from '../util/index.js';
import {
    pushTarget,
    popTarget
} from './dep.js';
import {
    queueWatcher
} from './scheduler.js';

export default class Watcher {

    constructor(vm, expOrFn, cb, options) {

        this.vm = vm;
        if (options) {
            this.lazy = !!options.lazy;
        } else {
            this.lazy = false;
        }

        this.cb = cb;
        this.active = true;
        this.dirty = this.lazy;

        this.deps = [];
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = noop;
        }

        this.value = this.lazy ? undefined : this.get();
    }
    get() {
        pushTarget(this);
        const vm = this.vm;
        const value = this.getter.call(vm, vm);
        popTarget();
        this.cleanupDeps();
        return value;
    }
    addDep(dep) {

        const id = dep.id;

        // 由于 watcher在上一次收集的依赖与最新一次收集的依赖可能不完全一样
        // (例如 return this.a === 1 ? this.b : this.c 中this.a的值发生变化)
        // 为了避免额外计算, 所以每一次触发get方法时都会重新收集最新的依赖deps
        // 同时对比新旧deps,将过期的watcher从旧的deps中移除
        if (!this.newDepIds.has(id)) {

            this.newDepIds.add(id);
            this.newDeps.push(dep);

            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }
    cleanupDeps() {

        let i = this.deps.length;
        while (i--) {
            const dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }

        // 重置 newDepIds
        let temp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = temp;
        this.newDepIds.clear();

        // 重置 newDeps
        temp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = temp;
        this.newDeps.length = 0;
    }
    update() {
        if (this.lazy) {
            this.dirty = true;
        } else {
            queueWatcher(this);
        }
    }
    run() {
        if (this.active) {
            // get会触发render watcher传入的expOrFn
            this.get();
        }
    }
}