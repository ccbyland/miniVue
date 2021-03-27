import VNode from './vnode.js';
import {
    patchVNode
} from './patchVNode.js'
import {
    doPatch
} from './doPatch.js'
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
        // 将真实节点转为虚拟节点
        oldNode = new VNode(oldNode.tagName.toLowerCase(), {}, [], undefined, oldNode);
        // 暂存旧的真实节点
        const oldElm = oldNode.elm;
        // 获取旧真实节点的父节点
        const parentElm = oldElm.parentNode;
        // 将新节点也转为真实节点
        const newElm = createElement(newNode);
        // 新的真实节点插入到旧的真实节点后面
        parentElm.insertBefore(newElm, oldElm.nextSibling);
        // 删除旧的真实节点
        parentElm.removeChild(oldElm);

        log(['patch', '非首次']);
        // 存在旧的虚拟节点
    } else {
        // 直接diff 新旧虚拟节点
        const patches = patchVNode(oldNode, newNode);
        log(['patches', patches]);
        // 将真实的旧节点和补丁包传给doPatch开始打补丁
        doPatch(oldNode.el, patches);
        log(['patch', '非首次']);
    }
}

/**
 * 将虚拟节点转真实节点
 * @param {*} vnode 
 * @returns 
 */
export function createElement(vnode) {

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

/**
 * 更新属性列表
 * @param {*} el 
 * @param {*} attrs 
 */
function updateAttrs(el, attrs) {
    for (const key in attrs) {
        updateAttr(el, key, attrs[key]);
    }
}

/**
 * 更新属性
 * @param {*} el 
 * @param {*} key 
 * @param {*} value 
 */
export function updateAttr(el, key, value) {
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