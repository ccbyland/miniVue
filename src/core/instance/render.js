import {
    log
} from '../util/index.js';
import {
    installRenderHelpers
} from './render-helpers/index.js';

export function renderMixin(Vue) {

    installRenderHelpers(Vue.prototype);
    Vue.prototype._render = function () {
        log('_render');
        const vm = this;
        return vm.$options.render.call(vm);
    };

    Vue.prototype.$nextTick = function () {};
}

export function initRender(vm) {

    vm.$slots = {};
    vm.$scopedSlots = {};
}