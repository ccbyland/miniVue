import Watcher from '../observe/watcher.js';
import { noop, log } from '../util/index.js';

export function lifecycleMixin(Vue) {

    Vue.prototype._update = function () {
        log('_update');
    };

    Vue.prototype.$forceUpdate = function () {};

    Vue.prototype.$destroy = function () {};
}

export function initLifecycle() {}

export function mountComponent(vm, el) {

    vm.$el = el;
    if (!vm.$options.render) {
        vm.$options.render = createEmptyVNode;
    }
    callHook(vm, 'beforeMount');

    const updateComponent = () => {
        vm._update(vm._render());
        log(`访问了data属性 this.a 建立绑定关系`, vm.a);
    }

    new Watcher(vm, updateComponent, noop, {
        before(){
            callHook(vm, 'beforeUpdate')
        }
    });

    return;
}

export function callHook(vm, hook) {

    log('===[callHook]===', hook);

}