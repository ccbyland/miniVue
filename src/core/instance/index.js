import { initMixin } from './init.js';
import { stateMixin } from './state.js';
import { eventsMixin } from './events.js';
import { lifecycleMixin } from './lifecycle.js';
import { renderMixin } from './render.js';

function Vue(options){
    this._init(options);
}

// 添加Vue.prototype._init
initMixin(Vue);

// 添加Vue.prototype.$set Vue.prototype.$delete Vue.prototype.$watch
stateMixin(Vue);

// 添加Vue.prototype.$on Vue.prototype.$once Vue.prototype.$off Vue.prototype.$emit
eventsMixin(Vue);

// 添加Vue.prototype._update Vue.prototype.$forceUpdate Vue.prototype.$destroy
lifecycleMixin(Vue);

// 添加Vue.prototype._render Vue.prototype.$nextTick
renderMixin(Vue);

export default Vue;