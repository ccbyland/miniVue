import {
    createElement
} from '../../vdom/vnode.js';
import {
    toString
} from '../../../shared/util.js';
import {
    createTextVNode
} from '../../vdom/vnode.js';
import {
    renderStatic
} from './render-static.js';

export function installRenderHelpers(target) {

    target._c = createElement;
    target._s = toString;
    target._v = createTextVNode;
    target._m = renderStatic;
}