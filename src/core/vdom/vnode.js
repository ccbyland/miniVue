export function vnode(tag, key, props, children, text = undefined) {
    return {
        tag,
        key,
        props,
        children,
        text
    }
}

export const createEmptyVNode = (text) => {
    const node = new VNode()
    node.text = text
    node.isComment = true
    return node
  }