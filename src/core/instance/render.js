import { log } from '../util/index.js';

export function renderMixin(Vue){

    Vue.prototype._render = function(){
        
        log('_render');
        const vm = this;
        const render = vm.$options.render;
        const vnode = render(vm);
        return vnode;
    };

    Vue.prototype.$nextTick = function(){};
}

export function initRender(vm) {

    // vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
    vm.$createElement = () => {};
}