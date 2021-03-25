export default class VNode {
    constructor(tag, data, children, text) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
    }
}

export function createTextVNode(text) {
    return new VNode(undefined, undefined, undefined, text);
}