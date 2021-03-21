// import { createElement } from '../vdom/create-element.js';
import { log } from '../util/index.js';

export function renderMixin(Vue){

    Vue.prototype._render = function(){
        
        log('_render');
        // const vm = this;
        // const render = vm.$options.render;
        // vNode = render(vm, h);
        // return vNode;
    };

    Vue.prototype.$nextTick = function(){};
}

export function initRender(vm) {

    // vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
    vm.$createElement = () => {};
}