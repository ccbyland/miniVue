import ObserverWatcher from '../observer/Watcher.js';
import ComputedWatcher from '../computed/Watcher.js';
import { noop } from '../../../shared/util.js';

/**
 * 统一解析器
 */
export const parser = {
    /**
     * text编译
     *
     * @param {*} node
     * @param {*} exp
     * @param {*} vm
     */
    text(node, exp, vm) {
        let val;
        // exp格式：{{xxx}}
        // 是由 '{{xxx}}' 或者 '{{xxx.xxx}}' 或者 '{{xxx.xxx}} - {{xxx.xxx}}' 语法进入
        if (exp.indexOf('{{') !== -1) {
            val = exp.replace(/\{\{(.+?)\}\}/g, (...args) => {

                // 格式：xxx
                const e = args[1];

                // 当前属性来源于computed
                if (e.indexOf('.') == -1 && !vm.$data[e] && vm.$options.computed[e]) {
                    // 对computed订阅更新
                    const cb = () => {
                        const value = vm.$options.computed[e].call(vm);
                        this.updater.textUpdater(node, value);
                    };
                    new ComputedWatcher(vm, cb, noop, null, true, '渲染watcher');
                    return vm.$options.computed[e].call(vm);

                    // 来源于data
                } else {
                    // 对模板中的data值{{xxx}}订阅更新
                    new ObserverWatcher(e, vm, () => {
                        // 由于监听的都是单个对象
                        // 而这里可能存在'{{xxx.xxx}} - {{xxx.xxx}}'语法，所以不能直接使用返回值替换
                        // 在这里自己重新取值并更新
                        this.updater.textUpdater(node, this.getContentVal(exp, vm));
                    });
                    // 同时即刻也返回当前值
                    return this.getVal(e, vm);
                }
            });
            // exp格式：xxx
            // 是由 v-text('xxx') 语法进入
        } else {
            val = this.getVal(exp, vm);
            new ObserverWatcher(exp, vm, (newValue) => {
                this.updater.textUpdater(node, newValue);
            });
        }
        this.updater.textUpdater(node, val);
    },
    /**
     * html编译
     *
     * @param {*} node
     * @param {*} exp
     * @param {*} vm
     */
    html(node, exp, vm) {
        const val = this.getVal(exp, vm);
        this.updater.htmlUpdater(node, val);
        new ObserverWatcher(exp, vm, (newValue) => {
            this.updater.htmlUpdater(node, newValue);
        });
    },
    /**
     * model编译
     *
     * @param {*} node
     * @param {*} exp
     * @param {*} vm
     */
    model(node, exp, vm) {
        const val = this.getVal(exp, vm);
        this.updater.valueUpdater(node, val);
        // 数据 => 视图
        new ObserverWatcher(exp, vm, (newValue) => {
            this.updater.valueUpdater(node, newValue);
        });
        // 视图 => 数据
        node.addEventListener('input', ((e) => {
            this.setVal(exp, vm, e.target.value);
        }), false);
    },
    /**
     * on编译
     *
     * @param {*} node
     * @param {*} exp
     * @param {*} vm
     * @param {*} eventName
     */
    on(node, exp, vm, eventName) {
        const fn = vm.$options.methods && vm.$options.methods[exp];
        fn && node.addEventListener(eventName, fn.bind(vm), false);
    },
    /**
     * bind编译
     *
     * @param {*} node
     * @param {*} val
     * @param {*} vm
     * @param {*} attrName
     */
    bind(node, val, vm, attrName) {
        this.updater.attrUpdater(node, attrName, val);
    },
    /**
     * 根据多个语法表达式获取对应的值
     *
     * @param {*} exp {{xxx.xxx}} - {{xxx.xxx}}
     * @param {*} vm
     * @return {*}
     */
    getContentVal(exp, vm) {
        return exp.replace(/\{\{(.+?)\}\}/g, (...args) => {
            return this.getVal(args[1], vm);
        });
    },
    /**
     * 根据单个语法表达式获取对应的值
     *
     * @param {*} exp {{xxx}} 或者 {{xxx.xxx}}
     * @param {*} vm
     * @return {*}
     */
    getVal(exp, vm) {
        // 遍历表达式每个对象属性
        return exp.split('.').reduce((data, curr) => {
            return data[curr];
        }, vm.$data);
    },
    /**
     * 根据单个语法表达式设置对应的值
     *
     * @param {*} exp {{xxx}} 或者 {{xxx.xxx}}
     * @param {*} vm
     * @param {*} value
     */
    setVal(exp, vm, value) {
        // 遍历表达式每个对象属性
        exp.split('.').reduce((data, curr) => {
            data[curr] = value;
        }, vm.$data);
    },
    // 统一更新对象
    updater: {
        /**
         * 修改节点text
         * @param {*} node
         * @param {*} val
         */
        textUpdater(node, val) {
            node.textContent = val;
        },
        /**
         * 修改节点html
         * @param {*} node
         * @param {*} val
         */
        htmlUpdater(node, val) {
            node.innerHTML = val;
        },
        /**
         * 修改节点value
         * @param {*} node
         * @param {*} val
         */
        valueUpdater(node, val) {
            node.value = val;
        },
        /**
         * 修改节点attr
         * @param {*} node
         * @param {*} val
         */
        attrUpdater(node, attrName, val) {
            node.setAttribute(attrName, val);
        }
    }
}