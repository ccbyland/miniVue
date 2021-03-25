import {
    parseHTML
} from './html-parser.js';
import {
    parseText
} from './text-parser.js';

export function createASTElement(tagName, attrs) {
    return {
        type: 1,
        tag: tagName,
        attrs,
        parent,
        children: []
    };
}

export function parse(template, options) {
    let root, currentParent, stack = [];
    parseHTML(template, {
        // 标签的开始位置 钩子函数
        start(tag, attrs) {
            const element = createASTElement(tag, attrs);
            // 根节点设置
            if (!root) {
                root = element;
            }
            // 暂存当前节点，用于子节点的父节点
            currentParent = element;
            // 当前节点推入栈，用于保持和子节点的结构关系
            stack.push(element);
        },
        // 标签的结束位置 钩子函数
        end() {
            // 将当前节点推出栈，结束和子节点的结构关系
            const element = stack.pop();
            // 确认当前节点的父节点
            currentParent = stack[stack.length - 1];
            if (currentParent) {
                // 父子双向绑定
                element.parent = currentParent;
                currentParent.children.push(element);
            }
        },
        // 文本位置 钩子函数
        chars(text) {
            text = text.trim();
            if (text) {
                const children = currentParent.children;
                let expression;
                if (expression = parseText(text)) {
                    children.push({
                        type: 2,
                        expression,
                        text
                    });
                } else {
                    children.push({
                        type: 3,
                        text
                    });
                }
            }
        }
    });

    return root;
}