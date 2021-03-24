export default class VNode {
    constructor(tag, attrs, children, text) {
        this.tag = tag;
        this.attrs = attrs;
        this.children = children;
        this.text = text;
    }
}

export function createTextVNode(text) {
    return new VNode(undefined, undefined, undefined, text);
}