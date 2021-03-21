/**
 * 模板编译器
 */

import { parser } from './parser.js';

export default class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        // 1.将模板转为文档碎片对象
        const fragment = this.node2Fragment(this.el);
        // 2.编译文档碎片对象
        this.compile(fragment);
        // 3.将文档碎片追加到容器中
        this.el.appendChild(fragment);
    }
    /**
     * 编译文档碎片对象
     *
     * @param {*} fragment
     * @memberof Compile
     */
    compile(fragment) {
        // 强制转为数组进行遍历
        [...fragment.childNodes].forEach((child) => {
            // 元素节点
            if (this.isElementNode(child)) {
                this.compileElement(child);
                // 文本节点
            } else if (this.isTextNode(child)) {
                this.compileText(child);
            }
            // 递归子节点
            if (child.childNodes && child.childNodes.length) {
                this.compile(child);
            }
        });
    }
    /**
     * 编译元素节点
     *
     * @param {*} node
     * @memberof Compile
     */
    compileElement(node) {
        const {
            attributes
        } = node;
        // 强制转为数组进行遍历
        [...attributes].forEach((attr) => {
            let flag = false;
            const {
                name,
                value
            } = attr;
            // [j-]符号语法 - 绑定指令
            if (this.isDirective(name)) {
                // name：j-text j-html j-bind:src j-on:click
                const [, directive] = name.split('-');
                // directive：text html bind:src on:click
                const [commandName, operateName] = directive.split(':');
                // commandName：text html bind on
                // operateName：src click
                parser[commandName] && parser[commandName](node, value, this.vm, operateName);
                flag = true;
                // [@]符号语法 - 绑定事件
            } else if (this.isEvent(name)) {
                // @click
                const [, eventName] = name.split('@');
                // click
                parser.on(node, value, this.vm, eventName);
                flag = true;
                // [:]符号语法 - 绑定属性
            } else if (this.isAttribute(name)) {
                // :class :src
                const [, attrName] = name.split(':');
                // class src
                parser.bind(node, value, this.vm, attrName);
                flag = true;
            }
            // 移除属性
            flag && node.removeAttribute(name);
        });
    }
    /**
     * 编译文本节点
     *
     * @param {*} node
     * @memberof Compile
     */
    compileText(node) {
        const content = node.textContent;
        if (/\{\{(.+?)\}\}/.test(content)) {
            parser.text(node, content, this.vm);
        }
    }
    /**
     * 是否为指令
     *
     * @param {*} attrName
     * @return {*}
     * @memberof Compile
     */
    isDirective(attrName) {
        return attrName.startsWith('j-');
    }
    /**
     * 是否为事件
     *
     * @param {*} attrName
     * @return {*}
     * @memberof Compile
     */
    isEvent(attrName) {
        return attrName.startsWith('@');
    }
    /**
     * 是否为属性
     *
     * @param {*} attrName
     * @return {*}
     * @memberof Compile
     */
    isAttribute(attrName) {
        return attrName.startsWith(':');
    }
    /**
     * 是否为元素节点
     *
     * @param {*} node
     * @return {*}
     * @memberof Compile
     */
    isElementNode(node) {
        return this.getNodeType(node) === 1;
    }
    /**
     * 是否为文本节点
     *
     * @param {*} node
     * @return {*}
     * @memberof Compile
     */
    isTextNode(node) {
        return this.getNodeType(node) === 3;
    }
    /**
     * 获取节点类型
     *
     * @param {*} node
     * @return {*}
     * @memberof Compile
     */
    getNodeType(node) {
        return node.nodeType;
    }
    /**
     * 节点转为文档碎片
     *
     * @param {*} el
     * @return {*}
     * @memberof Compile
     */
    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        while (el.firstChild) {
            fragment.appendChild(el.firstChild);
        }
        return fragment;
    }
}