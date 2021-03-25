/**
 * 优化器
 * 在AST中找出静态子树并打上标记
 * @param {*} root 
 */
export function optimize(root) {

    // 标记静态节点
    markStatic(root);

    // 标记静态根节点
    markStaticRoots(root);
}

/**
 * 标记静态节点
 * @param {*} node 
 */
function markStatic(node) {
    node.static = isStatic(node);
    // 标签
    if (node.type === 1) {
        node.children.map(n => {
            // 递归处理子节点
            markStatic(n);
            // 存在一个子节点为非静态节点，则修改当前父节点为非静态节点
            if (!n.static) {
                node.static = false;
            }
        })
    }
}

/**
 * 标记静态根节点
 * @param {*} node 
 */
function markStaticRoots(node) {
    if (node.type === 1) {
        // 为静态节点 & 存在子节点 & 非一个文本子节点
        if (node.static && node.children.length && !(node.children.length === 1 && node.children[0].type === 3)) {
            node.staticRoot = true;
        } else {
            node.staticRoot = false;
        }
        if (node.children) {
            // 递归处理子节点
            node.children.map(n => {
                markStaticRoots(n);
            });
        }
    }
}

/**
 * 判断当前节点是否是静态节点
 * @param {*} node 
 * @returns 
 */
function isStatic(node) {

    // 动态文本
    if (node.type == 2) {
        return false;
    }

    // 静态文本
    if (node.type == 3) {
        return true;
    }

    // 标签 - 判断条件 还未实现，所以暂时写死false

    // 1.不能使用动态绑定语法，也就是说标签上不能有以 v-、@、:开头的属性
    // 2.不能使用v-if、v-for或者v-else指令
    // 3.不能是内置标签、也就是说标签名不能是slot或者component
    // 4.不能是组件，即标签名必须是保留标签，例如div是保留标签，list不是保留标签
    // 5.当前节点的父节点不能是带v-for指令的template标签
    // 6.节点中不存在动态属性节点才有的属性，也就是说从type、tag、attrsList、attrsMap、parent等这个范围内没找到
    return false;
}