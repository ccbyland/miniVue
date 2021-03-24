let oldNode;

export function patch(newNode, vm) {

    if (!oldNode) {
        oldNode = vm.$el;
    }
    const el = createElement(newNode);
    const parentElement = oldNode.parentNode;

    parentElement.insertBefore(el, oldNode.nextSibling);
    parentElement.removeChild(oldNode);
    oldNode = newNode.el;
}

function createElement(vnode) {

    const {
        tag,
        attrs,
        children,
        text
    } = vnode;
    // 标签
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);
        updateAttrs(vnode.el, attrs);
        // 子节点
        children.map(child => {
            vnode.el.appendChild(createElement(child));
        })
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