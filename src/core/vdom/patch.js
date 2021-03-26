import VNode from './vnode.js';
import {
    patchVnode
} from './patchVnode.js'
import {
    log
} from '../util/index.js';

/**
 * 打补丁
 * 
 * @param {*} oldNode 
 * @param {*} newNode 
 */
export function patch(oldNode, newNode) {

    // 不存在旧的虚拟节点
    if (oldNode.nodeType === 1) {
        oldNode = new VNode(oldNode.tagName.toLowerCase(), {}, [], undefined, oldNode);
        const oldElem = oldNode.elm;
        const parentElm = oldElem.parentNode;
        const newElm = createElement(newNode);
        parentElm.insertBefore(newElm, oldElem.nextSibling);
        parentElm.removeChild(oldElem);
    // 存在旧的虚拟节点
    }else{
        const patches = patchVnode(oldNode, newNode);
        // parentElm.insertBefore(oldElem, oldNode.elm.nextSibling);
        // parentElm.removeChild(oldNode.elm);
        log(['patches', patches]);
    }
}

function createElement(vnode) {

    const {
        tag,
        data,
        children,
        text
    } = vnode;
    // 标签
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);
        // 更新属性
        data && data.attrs && updateAttrs(vnode.el, data.attrs);
        // 更新子节点
        children && children.length && children.map(child => {
            vnode.el.appendChild(createElement(child));
        });
    } else {
        vnode.el = document.createTextNode(text);
    }

    return vnode.el;
}

function updateAttrs(el, attrs) {

    for (const key in attrs) {
        const value = attrs[key];
        if (key === 'style') {
            for (const s in value) {
                el.style[s] = value[s];
            }
        } else if (key === 'class') {
            el.className = value;
        } else {
            el.setAttribute(key, value);
        }
    }
}