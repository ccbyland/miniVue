// 匹配文本`{{xxx}}`
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

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

    return `_c("${el.tag}",${genAttrStr(el.attrs)},${genChildrenStr(el.children)})`;
}

/**
 * 属性处理
 * 
 * @param {*} attrs 
 * @returns 
 */
function genAttrStr(attrs = []) {

    if (!attrs.length) {
        return undefined;
    }
    // let attrsStr = '';
    let _attrs = {};
    attrs.map(attr => {
        const {
            name,
            value
        } = attr;
        // style 特殊处理 value可能格式： style="color:red;display:none;..."
        if (name === 'style') {
            let styles = {};
            value.split(';').map(style => {
                const [key, value] = style.split(':');
                styles[key] = value;
            });
            attr.value = styles;
        }
        // attrsStr += `${attr.name}:${JSON.stringify(attr.value)},`;
        _attrs[attr.name] = attr.value;
    });
    return JSON.stringify(_attrs);
}

/**
 * 子节点处理
 * 
 * @param {*} childrens 
 * @returns 
 */
function genChildrenStr(childrens = []) {

    if (!childrens.length) {
        return '';
    }
    let _childrens = [];
    childrens.map(children => {
        if (children.type == 1) {
            _childrens.push(genElement(children));
        } else {
            _childrens.push(genText(children.text));
        }
    });
    return _childrens.join(',');
}

/**
 * 文本处理
 * 
 * @param {*} text 
 * @returns 
 */
function genText(text) {

    if (!defaultTagRE.test(text)) {
        return `_v("${text}")`;
    }

    let match, index, textArr = [];
    // defaultTagRE.lastIndex 重置，避免多次处理文本时，lastIndex没有归为逐渐增加的情况
    // lastIndex 是正则表达式的一个可读可写的整型属性，用来指定下一次匹配的起始索引。
    // 具体看下方法API https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex
    let lastIndex = defaultTagRE.lastIndex = 0;
    while (match = defaultTagRE.exec(text)) {
        // 匹配到的字符位于原始字符串的基于0的索引值	
        index = match.index;
        // index > lastIndex，说明匹配到的{{}}不在起点位置，那中间的就都是静态文本
        if (index > lastIndex) {
            textArr.push(`"${text.slice(lastIndex, index)}"`);
        }
        // 装入匹配到的{{}}部分，并去掉可能存在的空格(xxx两边) 格式：{{ xxx }}
        textArr.push(`_s(${match[1].trim()})`);
        // 更新lastIndex，用于下一次循环时比较位置
        lastIndex = index + match[0].length;
    }
    // 文本还存在静态文本部分
    if (lastIndex < text.length) {
        textArr.push(`"${text.slice(lastIndex)}"`);
    }
    return `_v(${textArr.join('+')})`;
}