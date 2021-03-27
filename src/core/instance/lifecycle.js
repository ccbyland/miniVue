import Watcher from '../observe/watcher.js';
import {
    noop,
    log
} from '../util/index.js';
import {
    patch
} from '../vdom/patch.js';

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {

        const vm = this;
        // 更新当前旧节点，如果没有则说明第一次更新
        const prevVnode = vm._vnode;
        // 更新挂载的节点
        vm._vnode = vnode;

        // 非首次更新
        if (prevVnode) {
            patch(prevVnode, vnode);
            // 生命周期钩子 - created
            callHook(vm, 'updated');
            // 首次更新
        } else {
            patch(vm.$el, vnode);
        }
    };

    Vue.prototype.$forceUpdate = function () {};

    Vue.prototype.$destroy = function () {};
}

export function initLifecycle() {}

export function mountComponent(vm, el) {

    vm.$el = el;

    callHook(vm, 'beforeMount');

    const updateComponent = () => {
        vm._update(vm._render());
    }

    new Watcher(vm, updateComponent, noop, {
        before() {
            callHook(vm, 'beforeUpdate')
        }
    });

    callHook(vm, 'mounted')
    return vm;
}

export function callHook(vm, hook) {
    log(`===[callHook]=== ${hook}`);
    const expr = vm.$options[hook];
    typeof expr === 'function' && vm.$options[hook].call(vm);
}