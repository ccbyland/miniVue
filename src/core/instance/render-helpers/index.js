import {
    createElement
} from '../../vdom/create-element.js';
import {
    toString
} from '../../../shared/util.js';
import {
    createTextVNode
} from '../../vdom/vnode.js';

export function installRenderHelpers(target) {

    target._c = createElement;
    target._s = toString;
    target._v = createTextVNode;
}