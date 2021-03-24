import { log } from '../util/index.js';

export function renderMixin(Vue){

    Vue.prototype._render = function(){
        
        log('_render');
    };

    Vue.prototype.$nextTick = function(){};
}

export function initRender(vm) {

    // vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
    vm.$createElement = () => {};
}