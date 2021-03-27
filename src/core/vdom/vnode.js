export default class VNode {
    constructor(tag, data, children, text, elm) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.isStatic = false;
    }
}

export function createElement(tags, attrs, children) {
    return new VNode(tags, attrs, children);
}

export function createTextVNode(text) {
    return new VNode(undefined, undefined, undefined, text);
}