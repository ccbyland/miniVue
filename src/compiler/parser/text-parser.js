// 匹配文本`{{xxx}}`
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

/**
 * 文本处理
 * 
 * @param {*} text 
 * @returns 
 */
export function parseText(text) {

    if (!defaultTagRE.test(text)) {
        return;
    }

    let match, index, tokens = [];
    // defaultTagRE.lastIndex 重置，避免多次处理文本时，lastIndex没有归为逐渐增加的情况
    // lastIndex 是正则表达式的一个可读可写的整型属性，用来指定下一次匹配的起始索引。
    // 具体看下方法API https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex
    let lastIndex = defaultTagRE.lastIndex = 0;

    // 使用JSON.stringify的目的是为了给字符串包一层字符串
    while (match = defaultTagRE.exec(text)) {
        // 匹配到的字符位于原始字符串的基于0的索引值	
        index = match.index;
        // index > lastIndex，说明匹配到的{{}}不在起点位置，那中间的就都是静态文本
        if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        // 把变量改为 _s(x) 这样的形式也添加到数组中
        tokens.push(`_s(${match[1].trim()})`);
        // 设置lastIndex来保证下一轮循环时，正则表达式不再重复匹配已经解析过的问题本
        lastIndex = index + match[0].length;
    }
    // 当所有变量都处理完毕后，如果最后一个变量右边还有文本，就讲文本添加到数组中
    if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    return tokens.join('+');
}