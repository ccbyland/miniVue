import VNode from './vnode.js';

export function createElement(tags, attrs, children) {
    return new VNode(tags, attrs, children);
}