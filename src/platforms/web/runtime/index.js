import Vue from '../../../core/index.js';
import {
    query
} from '../util/index.js';
import {
    mountComponent
} from '../../../core/instance/lifecycle.js';

Vue.prototype.$mount = function (el) {

    el = el && query(el);
    return mountComponent(this, el);
}

export default Vue;