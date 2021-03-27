import {
    createElement,
    updateAttr
} from './patch.js';

let nIndex = 0;
export function doPatch(oldElm, patches) {
    elementWalk(oldElm, patches);
}

/**
 * 对节点更新补丁
 * 
 * @param {*} element 
 * @param {*} patches 
 */
function elementWalk(element, patches) {

    const patch = patches[nIndex];
    nIndex++;
    const childNodes = element.childNodes;

    [...childNodes].map(child => {
        elementWalk(child, patches);
    });
    if (patch) {
        patchAction(element, patch);
    }
}

/**
 * 执行补丁操作
 * @param {*} element 
 * @param {*} patch 
 */
function patchAction(element, patch) {
    patch.map(p => {
        switch (p.type) {
            case 'ATTR':
                // 可能是多个属性
                for (let i in p.attrs) {
                    const attr = p.attrs[i];
                    const {
                        key,
                        value
                    } = attr;
                    // 更新属性
                    if (value) {
                        updateAttr(element, key, value);
                        // 删除属性
                    } else {
                        element.removeAttribute(key);
                    }
                }
                break;
            case 'TEXT':
                element.textContent = p.text;
                break;
            case 'REPLACE':
                const newNode = createElement(p.newNode);
                element.parentNode.replaceChild(newNode, element);
                break;
            case 'REMOVE':
                element.parentNode.removeChild(element);
                break;
        }
    });
}