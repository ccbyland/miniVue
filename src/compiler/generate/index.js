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

    const state = new CodegenState();
    const code = ast ? genElement(ast, state) : '_c("div")';
    return {
        render: new Function(`with(this){ return ${code}}`),
        staticRenderFns: state.staticRenderFns
    }
}

function CodegenState() {
    this.staticRenderFns = [];
}
/**
 * 构造标签节点
 * 
 * @param {*} el 
 * @returns 
 */
function genElement(el, state) {
    // 是否是静态根节点
    if (el.staticRoot && !el.staticProcessed) {
        return genStatic(el, state);
    }
    return `_c("${el.tag}",${genAttr(el.attrs,el.tag)},${genChildren(el.children, state)})`;
}

function genStatic(el, state) {
    el.staticProcessed = true;
    state.staticRenderFns.push(new Function(`with(this){return ${genElement(el, state)}}`));
    return `_m(${state.staticRenderFns.length - 1})`;
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
    return `{attrs:{${attrsStr.slice(0, -1)}}}`;
}

/**
 * 子节点处理
 * 
 * @param {*} children 
 * @returns 
 */
function genChildren(children = [], state) {
    if (!children.length) {
        return '';
    }
    return `[${children.map(node => getNode(node, state)).join(',')}]`;
}

/**
 * 处理节点
 * @param {*} node 
 * @returns 
 */
function getNode(node, state) {
    // 标签
    if (node.type == 1) {
        return genElement(node, state);
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