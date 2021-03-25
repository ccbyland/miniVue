/**
 * ast 转 render函数
 * 
 * 引用原型函数
 * _c() => createElement()
 * _v() => createTextNode()
 * _s() => {{name}} => _s(name)
 * 
 * @param {*} ast 
 */
export function generate(ast) {
    return ast ? genElement(ast) : '_c("div")'
}

/**
 * 构造标签节点
 * 
 * @param {*} el 
 * @returns 
 */
function genElement(el) {
    return `_c("${el.tag}",${genAttr(el.attrs,el.tag)},${genChildren(el.children)})`;
}

/**
 * 属性处理
 * 
 * @param {*} attrs 
 * @returns 
 */
function genAttr(attrs = [], tag) {
    if (!attrs.length) {
        return undefined;
    }
    let attrsStr = '';
    attrs.map(attr => {
        let {
            name,
            value
        } = attr;
        // style 特殊处理 value可能格式： style="color:red;display:none;..."
        if (name === 'style') {
            let styles = '{';
            value.split(';').map(style => {
                if (style) {
                    const [key, value] = style.split(':');
                    styles += `'${key}':'${value}',`;
                }
            });
            value = styles.slice(0, -1) + '}';
        } else {
            value = `"${value}"`;
        }
        attrsStr += `"${name}":${value},`;
    });
    return `{${attrsStr.slice(0, -1)}}`;
}

/**
 * 子节点处理
 * 
 * @param {*} children 
 * @returns 
 */
function genChildren(children = []) {
    if (!children.length) {
        return '';
    }
    return children.map(node => getNode(node)).join(',');
}

/**
 * 处理节点
 * @param {*} node 
 * @returns 
 */
function getNode(node) {
    // 标签
    if (node.type == 1) {
        return genElement(node);
        // 文本
    } else {
        return getText(node);
    }
}

/**
 * 处理文本
 * @param {*} text 
 * @returns 
 */
function getText(text) {
    return `_v(${text.type == 2 ? text.expression : JSON.stringify(text.text)})`;
}