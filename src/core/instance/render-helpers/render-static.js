/**
 * vNode静态打标
 * @param {*} index 
 * @returns 
 */
export function renderStatic(index) {
    const node = this.$options.staticRenderFns[index].call(this);
    node.isStatic = true;
    return node;
}