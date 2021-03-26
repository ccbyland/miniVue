export const ATTR = 'ATTR';
export const TEXT = 'TEXT';
export const REPLACE = 'REPLACE';
export const REMOVE = 'REMOVE';

let patches = {};
let vnIndex = 0;

export function diff(oldVDom, newNDom) {

    let index = 0;
    vNodeWalk(oldVDom, newNDom, index);
    return patches;
}

/**
 * 节点diff
 * @param {*} oldNode 旧节点
 * @param {*} newNode 新节点
 * @param {*} index 索引
 */
function vNodeWalk(oldNode, newNode, index) {

    let vnPatch = [];

    // 节点被删除
    if (!oldNode) {
        vnPatch.push({
            type: REMOVE,
            index: index
        });
        // 文本节点
    } else if (typeof oldNode === 'string' && typeof newNode === 'string') {
        // 文本更新
        if (oldNode != newNode) {
            vnPatch.push({
                type: TEXT,
                index: newNode
            });
        }
        // 标签属性
    } else if (oldNode.type === newNode.type) {
        const attrPatch = attrsWalk(oldNode.data.attrs || [], newNode.data.attrs || []);
        // 存在属性变更
        if (Object.keys(attrPatch).length) {
            vnPatch.push({
                type: ATTR,
                attrs: attrPatch
            })
        }
        debugger
        // 遍历子节点
        childWalk(oldNode.children, newNode.children)

        // 节点被替换
    } else {

        vnPatch.push({
            type: REPLACE,
            newNode
        });
    }

    if (vnPatch.length) {
        patches[index] = vnPatch;
    }

    console.error(patches);
}

/**
 * diff 属性
 * @param {]]} oldAttrs 
 * @param {*} newAttrs 
 * @returns 
 */
function attrsWalk(oldAttrs, newAttrs) {

    let attrsPatch = {};
    for (let key in oldAttrs) {
        // 修改、删除属性 - 新旧属性不一致
        if (oldAttrs[key] != newAttrs[key]) {
            attrsPatch[key] = newAttrs[key];
        }
    }
    for (let key in newAttrs) {
        // 新增属性
        if (!oldAttrs.hasOwnProperty(key)) {
            attrsPatch[key] = newAttrs[key];
        }
    }
    return attrsPatch;
}

/**
 * diff 子节点
 * @param {*} oldChildren 
 * @param {*} newChildren 
 */
function childWalk(oldChildren, newChildren) {
    oldChildren.map((c, idx) => {
        vNodeWalk(c, newChildren[idx], ++vnIndex)
    })
}