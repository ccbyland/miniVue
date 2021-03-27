export const ATTR = 'ATTR';
export const TEXT = 'TEXT';
export const REPLACE = 'REPLACE';
export const REMOVE = 'REMOVE';

let patches = {};
let nodeIndex = 0;

/**
 * 比较新旧节点返回补丁包
 * @param {*} oldNode 
 * @param {*} newDom 
 * @returns 
 */
export function patchVNode(oldNode, newNode) {

    vNodeWalk(oldNode, newNode, nodeIndex);
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
    } else if (!oldNode.tag && !newNode.tag) {
        if (oldNode.text.match(/\n/) && newNode.text.match(/\n/)) {
            return;
        }
        // 文本更新
        if (oldNode.text != newNode.text) {
            vnPatch.push({
                type: TEXT,
                text: newNode.text
            });
        }
        // 标签属性
    } else if (oldNode.type === newNode.type) {
        // attrPatch格式 {}
        const attrPatch = attrsWalk(oldNode.data, newNode.data);
        // 存在属性变更
        if (Object.keys(attrPatch).length) {
            vnPatch.push({
                type: ATTR,
                attrs: attrPatch
            })
        }
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
}

/**
 * diff 属性
 * @param {]]} oldAttrs 
 * @param {*} newAttrs 
 * @returns 
 */
function attrsWalk(oldData = {}, newData = {}) {

    const oldAttrs = oldData.oldAttrs || [];
    const newAttrs = newData.newAttrs || [];

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
function childWalk(oldChildren = [], newChildren = []) {
    oldChildren.map((c, idx) => {
        vNodeWalk(c, newChildren[idx], ++nodeIndex)
    });
}