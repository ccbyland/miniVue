import Watcher from '../observe/watcher.js';
import { noop, log } from '../util/index.js';
import {
    createEmptyVNode
} from '../vdom/vnode.js';

export function lifecycleMixin(Vue) {

    Vue.prototype._update = function () {

        log('_update');
        // const vm = this;
        // const el = vm.$el;
        // const preVNode = vm.preVNode;
        // // 首次渲染
        // if(!preVNode){
        //     vm.preVNode = vNode;
        //     render(vNode, el);
        // // 二次更新
        // }else{
        //     vm.$el = patch(preVNode, vNode);
        // }
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
        // debugger
        // vm._update(vm._render());
        log(`访问了data属性 this.a 建立绑定关系`, vm.a);
        log('视图渲染');
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