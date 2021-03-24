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

        log('_update');
        const vm = this;
        patch(vnode, vm);
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

    return;
}

export function callHook(vm, hook) {

    log('===[callHook]===', hook);

}