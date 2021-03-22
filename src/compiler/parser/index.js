import {
    parseHTML
} from './html-parser.js';

export function parse(template, options) {

    parseHTML(template, {
        // 标签的开始位置 钩子函数
        start(tag, attrs, unary) {},
        // 标签的结束位置 钩子函数
        end() {},
        chars(text) {
            // 文本位置 钩子函数
        },
        comment(text) {
            // 注释时位置 钩子函数
        }
    });
}