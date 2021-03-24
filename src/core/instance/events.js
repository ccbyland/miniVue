export function eventsMixin(Vue) {

    Vue.prototype.$on = function () {};

    Vue.prototype.$off = function () {};

    Vue.prototype.$one = function () {};

    Vue.prototype.$emit = function () {};
}

export function initEvents() {}