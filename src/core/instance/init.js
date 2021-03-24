import {
    initLifecycle,
    callHook
} from './lifecycle.js';
import {
    initEvents
} from './events.js';
import {
    initRender
} from './render.js';
import {
    initState
} from './state.js';

export function initMixin(Vue) {

    Vue.prototype._init = function (options) {

        const vm = this;
        vm.$options = options;

        // 初始化实例属性
        // 例如 wm.$parent wm.$root wm.$children wm.$refs 
        initLifecycle(vm);

        // 初始化事件
        // 将父组件在模板中使用的v-on事件添加到子组件的事件系统中
        initEvents(vm);

        // 初始化渲染函数
        // 例如 vm.$createElement
        initRender(vm);

        // 生命周期钩子 - beforeCreated
        callHook(vm, 'beforeCreated')

        // 初始化状态
        // 例如 props methods data computed watch
        initState(vm);

        // 生命周期钩子 - created
        callHook(vm, 'created');

        // 生命周期第一阶段 - 初始化阶段End
        // 生命周期第二阶段 - 模板编译阶段Start
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    }
}